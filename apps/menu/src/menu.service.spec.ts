import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '@app/prisma';
import { MenuType } from '@prisma/client';
import { CreateMenuDto } from './dto/create-menu.dto';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

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
    const module: TestingModule = await Test.createTestingModule({
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
            userRole: {
              findMany: jest.fn(),
            },
            roleMenu: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a menu', async () => {
      const createMenuDto: CreateMenuDto = {
        name: '系统管理',
        type: MenuType.DIRECTORY,
      };

      const result = await service.create(createMenuDto);
      expect(result).toEqual(mockMenu);
      expect(prisma.menu.create).toHaveBeenCalledWith({
        data: createMenuDto,
      });
    });
  });

  describe('getMenuTree', () => {
    it('should return menu tree', async () => {
      const result = await service.getMenuTree();
      expect(result).toEqual([mockMenu]);
      expect(prisma.menu.findMany).toHaveBeenCalledWith({
        orderBy: {
          orderNum: 'asc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a menu by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockMenu);
      expect(prisma.menu.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const updateData = { name: '更新后的菜单' };
      const result = await service.update(1, updateData);
      expect(result).toEqual(mockMenu);
      expect(prisma.menu.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockMenu);
      expect(prisma.menu.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('buildMenuTree', () => {
    it('should build menu tree correctly', async () => {
      const menus = [
        { ...mockMenu, id: 1, parentId: null },
        { ...mockMenu, id: 2, parentId: 1 },
        { ...mockMenu, id: 3, parentId: 1 },
      ];

      jest.spyOn(prisma.menu, 'findMany').mockResolvedValue(menus);

      const result = await service.getMenuTree();
      expect(result).toEqual([
        {
          ...menus[0],
          children: [{ ...menus[1] }, { ...menus[2] }],
        },
      ]);
    });
  });

  describe('getUserMenus', () => {
    it('should return user menus', async () => {
      const mockUserRoles = [{ roleId: 1 }];
      const mockRoleMenus = [
        {
          menu: {
            id: 1,
            name: '系统管理',
            parentId: null,
          },
        },
      ];

      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue(mockUserRoles);
      jest.spyOn(prisma.roleMenu, 'findMany').mockResolvedValue(mockRoleMenus);

      const result = await service.getUserMenus(1);
      expect(result).toBeDefined();
      expect(prisma.userRole.findMany).toHaveBeenCalled();
      expect(prisma.roleMenu.findMany).toHaveBeenCalled();
    });
  });

  describe('checkMenuPermission', () => {
    it('should return true when user has permission', async () => {
      const mockUserRoles = [{ roleId: 1 }];
      const mockRoleMenu = { id: 1 };

      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue(mockUserRoles);
      jest.spyOn(prisma.roleMenu, 'findFirst').mockResolvedValue(mockRoleMenu);

      const result = await service.checkMenuPermission(1, 1);
      expect(result).toBe(true);
    });

    it('should return false when user has no permission', async () => {
      jest.spyOn(prisma.userRole, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.roleMenu, 'findFirst').mockResolvedValue(null);

      const result = await service.checkMenuPermission(1, 1);
      expect(result).toBe(false);
    });
  });
});
