import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/role.guard';
import { OrderService } from '../order/order.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post()
  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query('category_id') categoryId?: number) {
    if (categoryId) {
      return this.productService.findByCategory(categoryId);
    }
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }


}
