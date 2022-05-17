import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getMainModules } from '../../app.module';
import { TestSchemaProvider } from '../../__test__/test-schema-provider.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CategoriesService } from '../categories/categories.service';
import { getConnection } from 'typeorm';

describe('ProductsController', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let categoryService: CategoriesService;
  let cleanSchemaProvider: TestSchemaProvider;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [...getMainModules()],
      controllers: [ProductsController],
      providers: [ProductsService, TestSchemaProvider, ValidationPipe],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    categoryService = moduleFixture.get<CategoriesService>(CategoriesService);
    cleanSchemaProvider =
      moduleFixture.get<TestSchemaProvider>(TestSchemaProvider);
  });

  afterAll(async () => {
    await cleanSchemaProvider.clear();
  });

  beforeEach(async () => {
    const connection = getConnection();
    await connection.close();
    await connection.connect();
    await cleanSchemaProvider.clear();
  });

  it('Deve conseguir inserir um produto simples parametrizando apenas o campo nameCategory, e é esperado q essa categoria seja inserida na base', async () => {
    let categoriaInserida;
    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Nome do Produto',
        nameCategory: 'Nome da Categoria',
      })
      .expect(201)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('category');

        categoriaInserida = result.category;
        expect(result.category).toHaveProperty('id');
        return expect(result.category).toHaveProperty('name');
      })
      .then(async () => {
        // espera-se q a categoria inserida seja retornada na resposta do controller de categories
        const c = await categoryService.findOne(categoriaInserida.id);
        expect(+c.id).toEqual(+categoriaInserida.id);
        return expect(c.name).toEqual(categoriaInserida.name);
      });
  });
  it('Deve conseguir inserir um produto parametrizando apenas um idCategory existente', async () => {
    const categoriaInserida = await categoryService.create({
      name: 'Nome da Categoria',
    });

    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Nome do Produto',
        idCategory: categoriaInserida.id,
      })
      .expect(201)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('category');
        expect(result.category).toHaveProperty('id');
        expect(result.category).toHaveProperty('name');

        // comprovando que a categoriaInserida é a mesma categoria que foi retornada dentro do produto
        expect(result.category.id).toEqual(categoriaInserida.id);
        expect(result.category.name).toEqual(categoriaInserida.name);
      });
  });
  it('Não deve conseguir inserir um produto sem parametrizar uma categoria', async () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Nome do Produto',
      })
      .expect(400);
  });
});
