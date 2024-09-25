import { Test, TestingModule } from '@nestjs/testing';
import { BrowserController } from './browser.controller';
import { BrowserService } from './browser.service';

describe('BrowserController', () => {
  let browserController: BrowserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BrowserController],
      providers: [BrowserService],
    }).compile();

    browserController = app.get<BrowserController>(BrowserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(browserController.getHello()).toBe('Hello World!');
    });
  });
});
