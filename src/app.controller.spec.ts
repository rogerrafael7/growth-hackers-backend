import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getMainModules } from './app.module';
import { TestSchemaProvider } from './__test__/test-schema-provider.service';

describe('AppController', () => {
  let appController: AppController;
  let cleanSchemaProvider: TestSchemaProvider;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...getMainModules()],
      controllers: [AppController],
      providers: [TestSchemaProvider],
    }).compile();

    cleanSchemaProvider = app.get<TestSchemaProvider>(TestSchemaProvider);
    await cleanSchemaProvider.clear();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it(`Deveria responder 'Health Check'`, () => {
      expect(appController.getHello()).toBe('Health Check');
    });
  });
});
