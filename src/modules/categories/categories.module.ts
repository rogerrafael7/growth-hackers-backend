import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../database/entities/category.entity';
import { ProductEntity } from '../database/entities/product.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
})
export class CategoriesModule {}
