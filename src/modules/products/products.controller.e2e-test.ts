import * as request from 'supertest';
import { ProductDto } from './dto/product.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import * as path from 'path';
import { MainInstancesTest } from '../../__test__/index.e2e-spec';

export const productsControllerTest = (
  mainInstancesTest: MainInstancesTest,
) => {
  it('Deve conseguir EXPORTAR um arquivos json a partir de um ID de categoria', async () => {
    const category = await mainInstancesTest.categoryService.create(
      CreateCategoryDto.create({ name: 'Categoria 1' }),
    );
    await Promise.all([
      mainInstancesTest.productsService.create(
        ProductDto.create({ name: 'Produto 1', idCategory: category.id }),
      ),
      mainInstancesTest.productsService.create(
        ProductDto.create({ name: 'Produto 2', idCategory: category.id }),
      ),
      mainInstancesTest.productsService.create(
        ProductDto.create({ name: 'Produto 3', idCategory: category.id }),
      ),
    ]);

    return request(mainInstancesTest.app.getHttpServer())
      .get(`/products/${category.id}/export`)
      .expect(200)
      .expect('Content-Type', /json/i)
      .expect('Content-Disposition', /products.json/i);
  });
  it('NÃO deve conseguir EXPORTAR um arquivos json usando um ID inexistente', async () => {
    await mainInstancesTest.cleanSchemaProvider.clear();
    return request(mainInstancesTest.app.getHttpServer())
      .get(`/products/1/export`)
      .expect(404);
  });
  it('Deve conseguir IMPORTAR um arquivo json de produtos usando um ID de uma categoria categoria', async () => {
    const category = await mainInstancesTest.categoryService.create(
      CreateCategoryDto.create({ name: 'Categoria 1' }),
    );

    const filepath = path.resolve(process.cwd(), 'test', 'products.json');

    return request(mainInstancesTest.app.getHttpServer())
      .post(`/products/${category.id}/import`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', filepath)
      .then((response) => {
        const result = JSON.parse(response.text);
        expect(result.length).toEqual(4);
        expect(
          result.filter((p) => p.category && p.category.id).length,
        ).toEqual(4);
      });
  });

  it('Deve conseguir inserir um produto simples parametrizando apenas o campo nameCategory, e é esperado q essa categoria seja inserida na base', async () => {
    let categoriaInserida;
    return request(mainInstancesTest.app.getHttpServer())
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
        const c = await mainInstancesTest.categoryService.findOne(
          categoriaInserida.id,
        );
        expect(+c.id).toEqual(+categoriaInserida.id);
        return expect(c.name).toEqual(categoriaInserida.name);
      });
  });
  it('Deve conseguir inserir um produto parametrizando apenas um idCategory existente', async () => {
    const categoriaInserida = await mainInstancesTest.categoryService.create({
      name: 'Nome da Categoria',
    });

    return request(mainInstancesTest.app.getHttpServer())
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
    return request(mainInstancesTest.app.getHttpServer())
      .post('/products')
      .send({
        name: 'Nome do Produto',
      })
      .expect(400);
  });
};
