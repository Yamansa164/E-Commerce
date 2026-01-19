import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma_service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    readonly prismaService: PrismaService,
    readonly productService: ProductService,
  ) {}
  async addToCart(userId: number, createCartDto: CreateCartDto) {
    let cart = await this.prismaService.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await this.prismaService.cart.create({ data: { userId } });
    }
    await this.productService.findOne(createCartDto.productId);

    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { cartId: cart.id, productId: createCartDto.productId },
    });

    if (existingItem) {
      return this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (createCartDto.quantity ?? 1),
        },
      });
    } else {
      const product = await this.productService.findOne(
        createCartDto.productId,
      );
      return this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId: createCartDto.productId,
          quantity: createCartDto.quantity,
          price: product.price,
        },
      });
    }
  }

  async findCartItem(id: number) {
    const cartItem = await this.prismaService.cartItem.findFirst({
      where: { id },
    });
    if (!cartItem)
      throw new NotFoundException('this product is not on your cart');

    return cartItem;
  }

  getCart(userId: number) {
    return this.prismaService.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
  }

  async deleteCart(cartId: number) {
    
    await this.prismaService.cartItem.deleteMany({
      where: { cartId },
    });

    
    return this.prismaService.cart.delete({
      where: { id: cartId },
    });
  }

  async removeItem(itemId: number) {
    await this.findCartItem(itemId);
    return this.prismaService.cartItem.delete({ where: { id: itemId } });
  }

  async updateQuantity(itemId: number, quantity: number) {
    await this.findCartItem(itemId);

    return this.prismaService.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }
}
