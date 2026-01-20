import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  create(createProductDto: CreateProductDto, file?: any) {
    if (file) {
      const imageUrl = `/uploads/products/${file.filename}`;
      createProductDto.imageUrl = imageUrl;
    }
    return this.prismaService.product.create({ data: createProductDto });
  }

  async find(categoryId?: number, page = 1, perPage = 10) {
    if (page < 1 || perPage < 1) {
      throw new BadRequestException(
        'Page and perPage must be positive numbers',
      );
    }
    const skip = (Number(page) - 1) * perPage;

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) throw new NotFoundException('category not found');
    }

    const [total, products] = await this.prismaService.$transaction([
      this.prismaService.product.count({
        where: { categoryId },
      }),
      this.prismaService.product.findMany({
        where: { categoryId },
        select: { id: true, name: true, imageUrl: true, price: true },
        take: perPage,
        skip,
      }),
    ]);
    const pageCount = Math.ceil(total / perPage);

    return {
      data: products,
      meta: {
        total,
        currentPage: Number(page),
        limit: perPage,
        pageCount,
      },
    };
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
}
