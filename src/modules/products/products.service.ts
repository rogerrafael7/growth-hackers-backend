import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { EntityManager, Repository } from 'typeorm';
import { ProductEntity } from '../database/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../database/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { Readable } from 'stream';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  async exportByCategory(categoryId: number): Promise<Readable> {
    const products = await this.productEntityRepository.find({
      where: {
        category: categoryId,
      },
      relations: ['category'],
    });
    if (!products.length) {
      throw new HttpException(
        'Não existem dados para essa categoria',
        HttpStatus.NOT_FOUND,
      );
    }
    return Readable.from(JSON.stringify(products));
  }

  create(productDto: ProductDto) {
    return this.save(productDto);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.save(updateProductDto, id);
  }

  async save(productDto: ProductDto | UpdateProductDto, id?: number) {
    return this.productEntityRepository.manager.transaction(
      async (entityManager) => {
        if (id) {
          const productEntityRow = await this.productEntityRepository.findOne({
            id,
          });
          if (!productEntityRow) {
            throw new HttpException(
              'Registro não encontrado',
              HttpStatus.BAD_REQUEST,
            );
          }
        } else if (!productDto.idCategory && !productDto.nameCategory) {
          throw new HttpException(
            'É obrigatório a parametrização de uma categoria',
            HttpStatus.BAD_REQUEST,
          );
        }

        const productEntityRow = await this.productEntityRepository.create(
          productDto,
        );

        if (productDto.idCategory || productDto.nameCategory) {
          productEntityRow.category = await this.#ensureCategoryFromProductDto(
            productDto,
            entityManager,
          );
        }
        return id
          ? entityManager.update(ProductEntity, { id }, productEntityRow)
          : entityManager.save(ProductEntity, productEntityRow);
      },
    );
  }

  findAll() {
    return this.productEntityRepository.find({
      relations: ['category'],
    });
  }

  findOne(id: number) {
    return this.#verifyAndFindOne(id);
  }

  async remove(id: number) {
    const row = await this.#verifyAndFindOne(id);
    return this.productEntityRepository.remove(row);
  }

  async #ensureCategoryFromProductDto(
    productDto: ProductDto | UpdateProductDto,
    entityManager: EntityManager,
  ): Promise<CategoryEntity | null> {
    if (!productDto.idCategory && !productDto.nameCategory) {
      throw new HttpException(
        'Categoria é obrigatória',
        HttpStatus.BAD_REQUEST,
      );
    }
    let category = await entityManager.findOne(CategoryEntity, {
      where: [{ id: productDto.idCategory }, { name: productDto.nameCategory }],
    });

    if (!category && productDto.nameCategory) {
      category = await entityManager.save(CategoryEntity, {
        name: productDto.nameCategory,
      });
    }

    if (!category) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async #verifyAndFindOne(id: number): Promise<ProductEntity> {
    const entity = await this.productEntityRepository.findOne(
      {
        id,
      },
      {
        relations: ['category'],
      },
    );
    if (!entity) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return entity;
  }
}
