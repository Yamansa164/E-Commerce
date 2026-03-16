import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [ProductModule, forwardRef(() => OrderModule)],
  exports: [CartService],
})
export class CartModule {}
