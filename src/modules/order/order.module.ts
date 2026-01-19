import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma_service';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService,PrismaService,CartService,ProductService,CategoryService],
  exports:[OrderService]
})
export class OrderModule {}
