import { ConnectionOptions } from 'typeorm';
import { resolve as pathResolve } from 'path';
import { enviroment } from '../../enviroment';

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: enviroment.DB_HOST,
  port: +enviroment.DB_PORT,
  username: enviroment.DB_USERNAME,
  password: enviroment.DB_PASSWORD,
  database: enviroment.DB_NAME,
  synchronize: enviroment.NODE_ENV === 'development',
  logging: enviroment.NODE_ENV === 'development',
  entities: [pathResolve(__dirname, 'entities/*.entity{.ts,.js}')],
  migrations: [pathResolve(__dirname, 'migrations/**/*{.ts,.js}')],
};

export default ormConfig;
