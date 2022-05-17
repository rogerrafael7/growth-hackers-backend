import { ConnectionOptions } from 'typeorm';
import { resolve as pathResolve } from 'path';
import { enviroment } from '../../enviroment';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: enviroment.DB_HOST,
    port: +enviroment.DB_PORT,
    username: enviroment.DB_USERNAME,
    password: enviroment.DB_PASSWORD,
    database: enviroment.DB_NAME,
    synchronize: ['development', 'test'].includes(enviroment.NODE_ENV),
    logging: enviroment.NODE_ENV === 'development',
    entities: [pathResolve(__dirname, 'entities/*.entity{.ts,.js}')],
    migrations: [pathResolve(__dirname, 'migrations/**/*{.ts,.js}')],
    schema: enviroment.NODE_ENV === 'test' ? 'test' : 'public',
  } as ConnectionOptions;
});
