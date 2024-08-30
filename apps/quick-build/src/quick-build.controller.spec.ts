import { Test, TestingModule } from '@nestjs/testing';
import { QuickBuildController } from './quick-build.controller';
import { QuickBuildService } from './quick-build.service';

describe('QuickBuildController', () => {
  let quickBuildController: QuickBuildController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuickBuildController],
      providers: [QuickBuildService],
    }).compile();

    quickBuildController = app.get<QuickBuildController>(QuickBuildController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(quickBuildController.getHello()).toBe('Hello World!');
    });
  });
});
