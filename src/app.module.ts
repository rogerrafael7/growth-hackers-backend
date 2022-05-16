import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { DatabaseModule } from './modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import ormConfig from './modules/database/ormConfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    DatabaseModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
