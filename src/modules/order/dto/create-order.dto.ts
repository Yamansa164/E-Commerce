import { NullTypes } from '@prisma/client/runtime/client';
import { IsEAN, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  productId :number;



  @IsOptional()
  @IsNumber()
  quantity:number;
}
