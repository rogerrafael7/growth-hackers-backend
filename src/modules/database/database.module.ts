import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import ormConfig from './ormConfig';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
