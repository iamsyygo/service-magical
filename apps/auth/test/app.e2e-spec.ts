import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './../src/auth.module';
import { AuthService } from './../src/auth.service';
import { Sex } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signin (POST) - 成功登录', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: 'avatar.png',
      sex: 'male' as Sex,
    };
    jest.spyOn(authService, 'validateLocalUser').mockResolvedValue(mockUser);
    jest.spyOn(authService, 'createAccessToken').mockReturnValue('accessToken');
    jest
      .spyOn(authService, 'createRefreshToken')
      .mockReturnValue('refreshToken');

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: 1, email: 'test@example.com' },
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
  });

  it('/auth/signin (POST) - 用户验证失败', async () => {
    jest
      .spyOn(authService, 'validateLocalUser')
      .mockRejectedValue(new Error('User not found'));

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});
