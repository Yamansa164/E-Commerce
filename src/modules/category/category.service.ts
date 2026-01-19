import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma_service';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorator/role.decorator';

@Injectable()
export class CategoryService {
  constructor(readonly prismaSerivce: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaSerivce.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prismaSerivce.category.findMany();
  }

  async remove(id: number) {
    const category = await this.prismaSerivce.category.findUnique({
      where: { id },
      include: { products: true }, // 👈 load related products
    });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Category has related products and cannot be deleted',
      );
    }

    return this.prismaSerivce.category.delete({ where: { id } });
  }

  findOne(id: number) {
    const category = this.prismaSerivce.category.findFirst({ where: { id } });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }
}
