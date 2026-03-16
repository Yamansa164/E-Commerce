import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { OrderService } from '../order/order.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    readonly orderService: OrderService,
  ) {}

  @Post('add')
  addToCart(
    @Req() req: { user: { id: number } },
    @Body() createCartDto: CreateCartDto,
  ) {
    const userId = req.user.id;

    return this.cartService.addToCart(userId, createCartDto);
  }

  @Get()
  getCart(@Req() req: { user: { id: number } }) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Delete('item/:itemId')
  removeItem(
    @Req() req: { user: { id: number } },
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Patch('item/:itemId')
  updateQuantity(
    @Req() req: { user: { id: number } },
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(req.user.id, itemId, body.quantity);
  }

  @Post('checkOut')
  checkOut(@Req() req: { user: { id: number } }) {
    return this.orderService.checkOut(req.user.id);
  }
}
