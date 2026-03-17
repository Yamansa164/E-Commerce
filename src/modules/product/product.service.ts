import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { PrismaService } from 'src/prisma/prisma_service';
import { CategoryService } from '../category/category.service';
import { normalizePagination } from 'src/common/pagination';
import { paginatedOk } from 'src/common/base-response';

@Injectable()
export class ProductService {
  constructor(
    readonly prismaService: PrismaService,
    readonly categoryService: CategoryService,
  ) {}

  create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    if (file) {
      const imageUrl = `/uploads/products/${file.filename}`;
      createProductDto.imageUrl = imageUrl;
    }

    return this.prismaService.product.create({ data: createProductDto });
  }

  async find(filters: FilterProductsDto) {
    const { page, perPage, skip, take } = normalizePagination({
      page: filters.page,
      perPage: filters.perPage,
      maxPerPage: 100,
    });
    const categoryId = filters.categoryId ?? filters.category_id;

    if (page < 1 || perPage < 1) {
      throw new BadRequestException(
        'Page and perPage must be positive numbers',
      );
    }

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      await this.categoryService.findOne(categoryId);
      where.categoryId = categoryId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice,
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      filters.sort === 'priceAsc'
        ? { price: 'asc' }
        : filters.sort === 'priceDesc'
          ? { price: 'desc' }
          : { id: 'desc' };

    const [total, products] = await this.prismaService.$transaction([
      this.prismaService.product.count({
        where,
      }),
      this.prismaService.product.findMany({
        where,
        select: { id: true, name: true, imageUrl: true, price: true },
        orderBy,
        take,
        skip,
      }),
    ]);

    return paginatedOk({
      message: 'Products retrieved successfully',
      data: products,
      total,
      page,
      perPage,
    });
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.product.delete({ where: { id } });
  }
}
