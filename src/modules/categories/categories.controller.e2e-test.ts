import * as request from 'supertest';
import { MainInstancesTest } from '../../__test__/index.e2e-spec';

export const categoriesControllerTest = (
  mainInstancesTest: MainInstancesTest,
) => {
  it('Deve conseguir fazer uma inserção simples', async () => {
    return request(mainInstancesTest.app.getHttpServer())
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
    return request(mainInstancesTest.app.getHttpServer())
      .post('/categories')
      .expect(400);
  });
  it('Deve responder status 400 BAD Request se for parametrizado um valor inválido, uma categoria deve ter pelo menos 2 caracteres', async () => {
    return request(mainInstancesTest.app.getHttpServer())
      .post('/categories')
      .send({
        name: 'R',
      })
      .expect(400);
  });

  it('Deve conseguir obter uma lista de categorias', async () => {
    await mainInstancesTest.cleanSchemaProvider.clear();
    return request(mainInstancesTest.app.getHttpServer())
      .get('/categories')
      .expect(200)
      .then(async (response) => {
        const result = JSON.parse(response.text);
        expect(result.length).toEqual(0);
      });
  });

  it('Deve conseguir atualizar o nome de uma categoria', async () => {
    const response = await request(mainInstancesTest.app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(mainInstancesTest.app.getHttpServer())
      .patch(`/categories/${categoriaInserida.id}`)
      .send({ name: 'Novo Nome' })
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.affected).toEqual(1);
      })
      .then(async () => {
        return request(mainInstancesTest.app.getHttpServer())
          .get(`/categories/${categoriaInserida.id}`)
          .expect(200, {
            id: categoriaInserida.id,
            name: 'Novo Nome',
          });
      });
  });
  it('Deve falhar se tentar atualizar o nome de uma categoria, sem parametrizar os campos obrigatórios', async () => {
    const response = await request(mainInstancesTest.app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(mainInstancesTest.app.getHttpServer())
      .patch(`/categories/${categoriaInserida.id}`)
      .expect(400);
  });

  it('Deve conseguir remover uma categoria a partir de seu ID', async () => {
    const response = await request(mainInstancesTest.app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Categoria de Teste',
      });

    const categoriaInserida = JSON.parse(response.text);

    return request(mainInstancesTest.app.getHttpServer())
      .del(`/categories/${categoriaInserida.id}`)
      .expect(200)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.name).toEqual(categoriaInserida.name);
      });
  });
  it('NÃO deve conseguir remover uma categoria se esta estiver vinculada a um produto', async () => {
    const response = await request(mainInstancesTest.app.getHttpServer())
      .post('/products')
      .send({
        name: 'Produto de teste',
        nameCategory: 'Categoria de Teste',
      });

    const produtoInserido = JSON.parse(response.text);

    return request(mainInstancesTest.app.getHttpServer())
      .del(`/categories/${produtoInserido.category.id}`)
      .expect(400, {
        statusCode: 400,
        message:
          'Categoria não pôde ser removida, existem produtos relacionados a ela',
      });
  });
};
