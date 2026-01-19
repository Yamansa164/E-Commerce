import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { CategoryExistsRule } from '../validation/category.exist.validation';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @Validate(CategoryExistsRule)
  categoryId: number;
}
