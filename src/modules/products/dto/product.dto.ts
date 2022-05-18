import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Nome do produto',
  })
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
  })
  @IsOptional()
  @Length(5, 500)
  description: string;

  @ApiProperty({
    description: 'Id da categoria da qual o produto será relacionado',
    required: false,
  })
  @IsOptional()
  @IsInt()
  idCategory: number;

  @ApiProperty({
    description:
      'Nome da categoria da qual o produto será relacionado. Com essa propriedade preenchida, uma tupla de categoria será criada automaticamente',
    required: false,
  })
  @IsOptional()
  @IsString()
  nameCategory: string;

  static create(param: Partial<ProductDto>) {
    const instance = new ProductDto();
    for (const paramKey in param) {
      instance[paramKey] = param[paramKey];
    }
    return instance;
  }
}
