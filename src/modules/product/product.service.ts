import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma_service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    readonly prismaService: PrismaService,
    readonly categoryService: CategoryService,
  ) {}
  create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prismaService.product.findMany({
      select: { id: true, name: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id },
    });
    if (!product) throw new NotFoundException('product not found');

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
   
    await this.findOne(id);

    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async findByCategory(categoryId: number) {
    const category = await this.categoryService.findOne(categoryId);

    if (!category) throw new NotFoundException('category not found ');
    const products = await this.prismaService.product.findMany({
      where: { categoryId: categoryId },
    });

    return products;
  }
}
