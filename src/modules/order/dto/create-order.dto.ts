import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity?: number;
}
