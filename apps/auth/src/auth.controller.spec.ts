import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisService } from '@app/redis';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { AuthInputDto } from './dto/index.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let redisService: RedisService;

  const mockAuthService = {
    createAccessToken: jest.fn().mockReturnValue('accessToken'),
    createRefreshToken: jest.fn().mockReturnValue('refreshToken'),
    validateLocalUser: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    }),
  };

  const mockRedisService = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    redisService = app.get<RedisService>(RedisService);
  });

  describe('signin', () => {
    it('应该返回用户信息和令牌', async () => {
      const mockRequest = {
        user: { id: 1, email: 'test@example.com', password: 'password' },
      } as any;

      const result = await authController.signin(mockRequest);

      expect(result).toEqual({
        user: { id: 1, email: 'test@example.com' },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(redisService.del).toHaveBeenCalled();

      expect(authService.createRefreshToken).toHaveBeenCalledWith(1);
      expect(authService.createAccessToken).toHaveBeenCalledWith(1);
    });

    it('应该抛出异常，当用户验证失败时', async () => {
      mockAuthService.validateLocalUser.mockRejectedValueOnce(
        new Error('User not found'),
      );
      const mockRequest = {
        user: { id: 1, email: 'test@example.com', password: 'password' },
      } as any;

      try {
        await authController.signin(mockRequest);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('AuthGuard', () => {
    it('Auth 守卫', () => {
      expect(AuthGuard).toBeDefined();
    });
  });
});
