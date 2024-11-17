import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuType } from '@prisma/client';
import { PrismaService } from '@app/prisma';

describe('MenuController', () => {
  let menuController: MenuController;
  let menuService: MenuService;

  const mockMenu = {
    id: 1,
    parentId: null,
    name: '系统管理',
    path: '/system',
    component: 'Layout',
    permission: 'system',
    type: MenuType.DIRECTORY,
    icon: 'system',
    orderNum: 1,
    status: true,
    isExternal: false,
    keepAlive: false,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useValue: {
            menu: {
              create: jest.fn().mockResolvedValue(mockMenu),
              findMany: jest.fn().mockResolvedValue([mockMenu]),
              findUnique: jest.fn().mockResolvedValue(mockMenu),
              update: jest.fn().mockResolvedValue(mockMenu),
              delete: jest.fn().mockResolvedValue(mockMenu),
            },
          },
        },
      ],
    }).compile();

    menuController = app.get<MenuController>(MenuController);
    menuService = app.get<MenuService>(MenuService);
  });

  describe('create', () => {
    it('should create a menu', async () => {
      const createMenuDto: CreateMenuDto = {
        name: '系统管理',
        type: MenuType.DIRECTORY,
      };

      const result = await menuController.create(createMenuDto);
      expect(result).toEqual(mockMenu);
    });
  });

  describe('getMenuTree', () => {
    it('should return menu tree', async () => {
      const result = await menuController.getMenuTree();
      expect(result).toEqual([mockMenu]);
    });
  });

  describe('findOne', () => {
    it('should return a menu by id', async () => {
      const result = await menuController.findOne(1);
      expect(result).toEqual(mockMenu);
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const updateMenuDto = { name: '更新后的菜单' };
      const result = await menuController.update(1, updateMenuDto);
      expect(result).toEqual(mockMenu);
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      const result = await menuController.remove(1);
      expect(result).toEqual(mockMenu);
    });
  });
});
