import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 200)
  name: string;
}
