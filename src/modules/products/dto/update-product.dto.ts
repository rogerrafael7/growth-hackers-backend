import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(ProductDto) {
  @ApiProperty({
    description: 'Nome do produto',
  })
  @IsOptional()
  name;
}
