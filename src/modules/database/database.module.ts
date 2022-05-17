import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService) => {
        return configService.get('database');
      },
    }),
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
