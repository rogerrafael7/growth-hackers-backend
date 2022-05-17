import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class ProductDto {
  @Length(2, 100)
  name: string;

  @IsOptional()
  @Length(5, 500)
  description: string;

  @IsOptional()
  @IsInt()
  idCategory: number;

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
