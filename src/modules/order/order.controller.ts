import { Controller, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@Req() req) {
    return this.orderService.getOrders(req.userId);
  }
}
