import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma_service';
import { CategoryExistsRule } from './validation/category.exist.validation';
import { CategoryService } from '../category/category.service';
import { OrderModule } from '../order/order.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService,CategoryExistsRule],
  exports:[ProductService],
  imports:[CategoryModule]

})
export class ProductModule {}
