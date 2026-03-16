import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [forwardRef(() => CartModule)],
  exports: [OrderService],
})
export class OrderModule {}
