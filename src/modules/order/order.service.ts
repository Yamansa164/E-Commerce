import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma_service';
import { CartService } from '../cart/cart.service';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  normalizePagination,
} from 'src/common/pagination';

const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  ReadonlyArray<OrderStatus>
> = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};


@Injectable()
export class OrderService {
  constructor(
    readonly prismaService: PrismaService,
    readonly cartService: CartService,
  ) {}

  async checkOut(userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const totalPrice = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const order = await this.prismaService.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { orderItems: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return order;
  }

  async getOrders(userId: number, page = 1, perPage = 10) {
    if (!Number.isFinite(page) || !Number.isFinite(perPage)) {
      throw new BadRequestException(
        'Page and perPage must be positive numbers',
      );
    }

    const { page: normalizedPage, perPage: normalizedPerPage, skip, take } =
      normalizePagination({ page, perPage, maxPerPage: 100 });

    const [total, orders] = await this.prismaService.$transaction([
      this.prismaService.order.count({ where: { userId } }),
      this.prismaService.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return {
      data: orders,
      total,
      page: normalizedPage,
      perPage: normalizedPerPage,
    };
  }

  private assertValidStatusTransition(current: OrderStatus, next: OrderStatus) {
    if (current === next) return;

    const allowedNext = ORDER_STATUS_TRANSITIONS[current] ?? [];
    const ok = allowedNext.includes(next);
    if (ok) return;

    throw new BadRequestException(
      `Invalid status transition: ${current} -> ${next}. Allowed next: ${allowedNext.join(', ') || 'none'}`,
    );
  }

  async updateOrderStatus(body: UpdateOrderStatusDto) {
    const { orderId, status } = body;
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.assertValidStatusTransition(order.status, status);

    return this.prismaService.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
  async cancelOrder(userId: number, orderId: number) {
    const order = await this.prismaService.order.findFirst({
      where: { userId, id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.prismaService.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.cancelled },
    });
  }
}
