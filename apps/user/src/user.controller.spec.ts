import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      createUser: jest
        .fn()
        .mockImplementation((user: Prisma.UserCreateInput) => {
          return { id: 1, ...user };
        }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user and return the user object', async () => {
      const userDto: Prisma.UserCreateInput = {
        username: 'testuser',
        password: 'testpassword',
        email: '',
      };

      const result = await userController.createUser(userDto);
      expect(result).toEqual({ id: 1, ...userDto });
      expect(userService.createUser).toHaveBeenCalledWith(userDto);
    });
  });
});
