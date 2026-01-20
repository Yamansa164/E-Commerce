import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma_service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    readonly prismaService: PrismaService,
    readonly cartService: CartService,
  ) {}

  async checkOut(userId: number) {
    let cart = await this.cartService.getCart(userId);
    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }
    const totalPrice = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
      0,
    );

    const order = this.prismaService.order.create({
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
    await this.cartService.deleteCartItem(cart.id);
    return order;
  }

  async getOrders(userId: number, page = 1, perPage = 10) {
    if (page < 1 || perPage < 1) {
      throw new BadRequestException(
        'Page and perPage must be positive numbers',
      );
    }

    const skip = ( Number(page) - 1) * perPage;

    const [total, orders] = await this.prismaService.$transaction([
      this.prismaService.order.count({ where: { userId } }),
      this.prismaService.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
    ]);

    const pageCount = Math.ceil(total / perPage);

    return {
      data: orders,
      meta: {
        total,
        currentPage: Number(page),
        limit: perPage,
        pageCount,
      },
    };
  }
}
