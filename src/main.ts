import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module');
  const { enviroment } = await import('./enviroment');

  const app = await NestFactory.create(AppModule);
  await app.listen(enviroment.PORT);
}
bootstrap();
