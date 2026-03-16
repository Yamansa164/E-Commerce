import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma_service';

@Injectable()
export class CategoryService {
  constructor(readonly prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  async remove(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Category has related products and cannot be deleted',
      );
    }

    return this.prismaService.category.delete({ where: { id } });
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    });

    if (!category) throw new NotFoundException('category not found');

    return category;
  }
}
