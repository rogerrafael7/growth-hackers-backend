import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../modules/categories/categories.service';
import { TestSchemaProvider } from './test-schema-provider.service';
import { ProductsService } from '../modules/products/products.service';
import { getMainModules } from '../app.module';
import { ProductsController } from '../modules/products/products.controller';
import { getConnection } from 'typeorm';
import { productsControllerTest } from '../modules/products/products.controller.e2e-test';
import { categoriesControllerTest } from '../modules/categories/categories.controller.e2e-test';

export type MainInstancesTest = Partial<{
  app: INestApplication;
  moduleFixture: TestingModule;
  categoryService: CategoriesService;
  cleanSchemaProvider: TestSchemaProvider;
  productsService: ProductsService;
}>;

describe('Testes', () => {
  const mainInstances: MainInstancesTest = {};

  beforeAll(async () => {
    mainInstances.moduleFixture = await Test.createTestingModule({
      imports: [...getMainModules()],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        CategoriesService,
        TestSchemaProvider,
        ValidationPipe,
      ],
    }).compile();

    mainInstances.app = mainInstances.moduleFixture.createNestApplication();
    await mainInstances.app.init();

    mainInstances.productsService =
      mainInstances.moduleFixture.get<ProductsService>(ProductsService);
    mainInstances.categoryService =
      mainInstances.moduleFixture.get<CategoriesService>(CategoriesService);
    mainInstances.cleanSchemaProvider =
      mainInstances.moduleFixture.get<TestSchemaProvider>(TestSchemaProvider);
  });

  afterEach(async () => {
    await mainInstances.cleanSchemaProvider.clear();
    const connection = getConnection();
    await connection.close();
  });

  beforeEach(async () => {
    const connection = getConnection();
    if (!connection.isConnected) {
      await connection.connect();
    }
    await mainInstances.cleanSchemaProvider.clear();
  });

  describe('ProductsController', () => {
    productsControllerTest(mainInstances);
  });

  describe('CategoriesController', () => {
    categoriesControllerTest(mainInstances);
  });
});
