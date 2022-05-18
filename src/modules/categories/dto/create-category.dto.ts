import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome do produto',
  })
  @IsString()
  @Length(2, 200)
  name: string;

  static create(param: Partial<CreateCategoryDto>) {
    const instance = new CreateCategoryDto();
    for (const paramKey in param) {
      instance[paramKey] = param[paramKey];
    }
    return instance;
  }
}
