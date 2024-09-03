import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user.service';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { EmailService } from '@app/email';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { hashSync } from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should register a user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      captcha: '123456',
    };
    const password = hashSync('password123', 10);

    jest.spyOn(redisService, 'get').mockResolvedValue('123456');
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    // @ts-expect-error - ignore for testing
    jest.spyOn(prismaService.user, 'create').mockResolvedValue({
      id: 2,
      username: 'testuser',
      email: 'test@example.com',
      password,
    });

    const result = await service.createUser(userData);
    expect(result).toEqual({
      id: 2,
      username: 'testuser',
      email: 'test@example.com',
      password,
    });
    expect(redisService.del).toHaveBeenCalledWith(
      'system_register_captcha:test@example.com',
    );
  });

  // it('should throw an error if captcha is expired', async () => {
  //   const userData = {
  //     email: 'test@example.com',
  //     username: 'testuser',
  //     password: 'password123',
  //     captcha: '123456',
  //   };

  //   jest.spyOn(redisService, 'get').mockResolvedValue(null);

  //   await expect(service.createUser(userData)).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  // it('should throw an error if captcha is incorrect', async () => {
  //   const userData = {
  //     email: 'test@example.com',
  //     username: 'testuser',
  //     password: 'password123',
  //     captcha: '123456',
  //   };

  //   jest.spyOn(redisService, 'get').mockResolvedValue('654321');

  //   await expect(service.createUser(userData)).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  // it('should throw an error if user already exists', async () => {
  //   const userData = {
  //     email: 'test@example.com',
  //     username: 'testuser',
  //     password: 'password123',
  //     captcha: '123456',
  //   };

  //   jest.spyOn(redisService, 'get').mockResolvedValue('123456');
  //   // @ts-expect-error - ignore for testing
  //   jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
  //     id: 1,
  //     username: 'testuser',
  //     email: 'test@example.com',
  //   });

  //   await expect(service.createUser(userData)).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });
});
