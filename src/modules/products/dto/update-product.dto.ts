import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(ProductDto) {
  @IsOptional()
  name;
}
