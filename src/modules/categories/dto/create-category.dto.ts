import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
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
