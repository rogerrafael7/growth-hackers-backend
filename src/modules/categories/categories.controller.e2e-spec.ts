import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { getMainModules } from '../../app.module';
import { TestSchemaProvider } from '../../__test__/test-schema-provider.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('CategoriesController', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let cleanSchemaProvider: TestSchemaProvider;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [...getMainModules()],
      controllers: [CategoriesController],
      providers: [CategoriesService, TestSchemaProvider, ValidationPipe],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

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

  it('Deve conseguir fazer uma inserção simples', async () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      })
      .expect(201)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result.name).toEqual('Categoria de Teste');
      });
  });
  it('Deve responder status 400 BAD Request se não for parametrizado os campos obrigatórios', async () => {
    return request(app.getHttpServer()).post('/categories').expect(400);
  });
  it('Deve responder status 400 BAD Request se for parametrizado um valor inválido, uma categoria deve ter pelo menos 2 caracteres', async () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'R',
      })
      .expect(400);
  });

  it('Deve conseguir obter uma lista de categorias', async () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.length).toEqual(0);
      });
  });

  it('Deve conseguir atualizar o nome de uma categoria', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(app.getHttpServer())
      .patch(`/categories/${categoriaInserida.id}`)
      .send({ name: 'Novo Nome' })
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.affected).toEqual(1);
      })
      .then(async () => {
        return request(app.getHttpServer())
          .get(`/categories/${categoriaInserida.id}`)
          .expect(200, {
            id: categoriaInserida.id,
            name: 'Novo Nome',
          });
      });
  });
  it('Deve falhar se tentar atualizar o nome de uma categoria, sem parametrizar os campos obrigatórios', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(app.getHttpServer())
      .patch(`/categories/${categoriaInserida.id}`)
      .expect(400);
  });

  it('Deve conseguir remover uma categoria a partir de seu ID', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(app.getHttpServer())
      .del(`/categories/${categoriaInserida.id}`)
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.name).toEqual(categoriaInserida.name);
      });
  });
  it('NÃO deve conseguir remover uma categoria se esta estiver vinculada a um produto', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Produto de teste',
        nameCategory: 'Categoria de Teste',
      });

    const produtoInserido = JSON.parse(response.text);

    return request(app.getHttpServer())
      .del(`/categories/${produtoInserido.category.id}`)
      .expect(400, {
        statusCode: 400,
        message:
          'Categoria não pôde ser removida, existem produtos relacionados a ela',
      });
  });
});
