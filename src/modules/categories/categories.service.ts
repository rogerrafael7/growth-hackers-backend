import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../database/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    readonly productsRepository: Repository<ProductEntity>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.#verifyAndFindOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.#verifyAndFindOne(id);
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const entity = await this.#verifyAndFindOne(id);
    const countProductsHasCategory = await this.productsRepository.count({
      where: {
        category: entity,
      },
    });
    if (countProductsHasCategory > 0) {
      throw new HttpException(
        'Categoria não pôde ser removida, existem produtos relacionados a ela',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.categoryRepository.remove(entity);
  }

  async #verifyAndFindOne(id: number): Promise<CategoryEntity> {
    const entity = await this.categoryRepository.findOne({ id });
    if (!entity) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }
    return entity;
  }
}
