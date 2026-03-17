import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  orderId: number;

  @IsInt()
  @Min(1)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
