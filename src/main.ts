import { enviroment } from './enviroment';

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(AppModule);
  await app.listen(enviroment.PORT);
}
bootstrap();
