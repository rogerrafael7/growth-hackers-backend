import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { Connection, EntityManager, Repository } from 'typeorm';
import { ProductEntity } from '../database/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../database/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    private connection: Connection,
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  create(productDto: ProductDto) {
    return this.save(productDto);
  }

  update(id: number, updateProductDto: ProductDto) {
    return this.save(updateProductDto, id);
  }

  async save(productDto: ProductDto, id?: number) {
    return this.connection.transaction(async (entityManager) => {
      let row;

      if (id) {
        row = await this.productEntityRepository.findOne({ id });
      } else {
        row = await this.productEntityRepository.create(productDto);
      }

      if (!row) {
        throw new HttpException(
          'Registro não encontrado',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!id || productDto.idCategory || productDto.nameCategory) {
        row.category = await this.#ensureCategoryFromProductDto(
          productDto,
          entityManager,
        );
      }
      return id
        ? entityManager.update(ProductEntity, { id }, productDto)
        : entityManager.save(ProductEntity, row);
    });
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
    productDto: ProductDto,
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
