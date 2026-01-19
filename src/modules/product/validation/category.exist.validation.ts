import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma_service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(categoryId: number, args: ValidationArguments) {
    if (categoryId == null) {
      return false;
    }


    const category = await this.prisma.category.findFirst({
      where: { id: categoryId },
    });
    console.log(`hhhhhhhh ${category}`);

    return category != null;
  }

  defaultMessage(args: ValidationArguments) {
    return `Category with id ${args.value} does not exist`;
  }
}
