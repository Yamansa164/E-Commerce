import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { CategoryExistsRule } from '../validation/category.exist.validation';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @Validate(CategoryExistsRule)
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;
}
