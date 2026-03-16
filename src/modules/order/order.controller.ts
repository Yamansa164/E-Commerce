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
import { ok, paginatedOk } from 'src/common/base-response';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const userId = req.user.id;
    const result = await this.orderService.getOrders(userId, page, perPage);
    return paginatedOk({
      message: 'orders fetched',
      data: result.data,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
    });
  }

  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  @Post('/update-status')
  async updateOrderStatus(@Body() body: UpdateOrderStatusDto) {
    const updated = await this.orderService.updateOrderStatus(body);
    return ok({
      message: 'order status updated',
      data: updated,
    });
  }

  @Get('/cancel')
  async cancelOrder(
    @Req() req,
    @Query('orderId', ParseIntPipe) orderId: number,
  ) {
    const userId = req.user.id;
    const cancelled = await this.orderService.cancelOrder(userId, orderId);
    return ok({
      message: 'order cancelled',
      data: cancelled,
    });
  }
}
