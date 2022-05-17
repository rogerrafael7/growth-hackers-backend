import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import dbConfiguration from './modules/database/ormConfig';
import { TestSchemaProvider } from './__test__/test-schema-provider.service';

export const getMainModules = () => {
  return [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    DatabaseModule,
    ProductsModule,
    CategoriesModule,
  ];
};

@Module({
  imports: [...getMainModules()],
  controllers: [AppController],
  providers: [TestSchemaProvider],
})
export class AppModule {}
