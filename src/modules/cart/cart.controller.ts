import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { OrderService } from '../order/order.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    readonly orderService: OrderService,
  ) {}

  @Post('add')
  addToCart(@Req() req, @Body() createCartDto: CreateCartDto) {
    const userId = req.user.id;

    return this.cartService.addToCart(userId, createCartDto);
  }

  @Get()
  getCart(@Req() req) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Delete('item/:itemId')
  removeItem(@Param('itemId') itemId: number) {
    return this.cartService.removeItem(itemId);
  }
  @Patch('item/:itemId')
  updateQuantity(
    @Param('itemId') itemId: number,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(itemId, body.quantity);
  }

  @Post('checkOut')
  checkOut(@Req() req) {
    return this.orderService.checkOut(req.user.id);
  }
}
