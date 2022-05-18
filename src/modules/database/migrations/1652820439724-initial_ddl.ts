import { MigrationInterface, QueryRunner } from 'typeorm';
import ormConfig from '../ormConfig';

export class initialDdl1652820439724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
          create table ${ormConfig.schema}.tb_category(
              id serial primary key,
              category_name varchar not null unique
          );
          create table ${ormConfig.schema}.tb_product
          (
              id                  serial primary key,
              product_name        varchar not null,
              product_description text,
              id_category         integer references tb_category(id)
          );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
