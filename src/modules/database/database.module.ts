import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import ormConfig from './ormConfig';
import { ConnectionOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig as ConnectionOptions),
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
