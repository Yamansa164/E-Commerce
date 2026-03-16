import {
  Controller,
  Get,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const userId = req.user.id;
    return this.orderService.getOrders(userId, page, perPage);
  }

  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  @Post('/update-status')
  updateOrderStatus(@Body() body: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(body);
  }

  @Get('/cancel')
  cancelOrder(@Req() req, @Query('orderId', ParseIntPipe) orderId: number) {
    const userId = req.user.id;
    return this.orderService.cancelOrder(userId, orderId);
  }
}
