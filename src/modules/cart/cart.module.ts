import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma_service';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports:[ProductModule, forwardRef(() => OrderModule)],
    exports:[CartService]

})
export class CartModule {}
