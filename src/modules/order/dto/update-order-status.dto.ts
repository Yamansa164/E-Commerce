import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  orderId: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
