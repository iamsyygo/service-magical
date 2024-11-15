import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Menu } from '@prisma/client';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // 创建菜单
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  // 获取菜单树
  async getMenuTree() {
    const menus = await this.prisma.menu.findMany({
      orderBy: {
        orderNum: 'asc',
      },
    });
    return this.buildMenuTree(menus);
  }

  // 获取单个菜单
  async findOne(id: number): Promise<Menu> {
    return this.prisma.menu.findUnique({
      where: { id },
    });
  }

  // 更新菜单
  async update(id: number, updateData: Partial<CreateMenuDto>): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data: updateData,
    });
  }

  // 删除菜单
  async remove(id: number): Promise<Menu> {
    return this.prisma.menu.delete({
      where: { id },
    });
  }

  // 构建菜单树
  private buildMenuTree(menus: Menu[], parentId: number | null = null): any[] {
    // Step 1: 创建 parentId -> 子节点列表的映射
    const menuMap = new Map<number | null, Menu[]>();

    for (const menu of menus) {
      if (!menuMap.has(menu.parentId)) {
        menuMap.set(menu.parentId, []);
      }
      menuMap.get(menu.parentId)!.push(menu);
    }

    // Step 2: 递归构建树，利用映射快速查找子节点
    const buildTree = (parentId: number | null): any[] => {
      const treeByParentId = menuMap.get(parentId);
      if (!treeByParentId) return null;

      return treeByParentId.map((menu) => {
        const children = buildTree(menu.id);
        const result = {
          ...menu,
        };
        if (children) {
          // @ts-expect-error
          result.children = children;
        }
        return result;
      });
    };

    return buildTree(parentId);
  }

  // 获取用户的菜单权限
  async getUserMenus(userId: number) {
    // 获取用户的所有角色ID
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map((ur) => ur.roleId);

    // 获取这些角色关联的所有菜单
    const roleMenus = await this.prisma.roleMenu.findMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
      include: {
        menu: true,
      },
    });

    // 提取菜单并去重
    const menuMap = new Map();
    roleMenus.forEach((rm) => {
      if (!menuMap.has(rm.menu.id)) {
        menuMap.set(rm.menu.id, rm.menu);
      }
    });

    const menus = Array.from(menuMap.values());
    return this.buildMenuTree(menus);
  }

  // 获取角色的菜单权限
  async getRoleMenus(roleId: number) {
    const roleMenus = await this.prisma.roleMenu.findMany({
      where: { roleId },
      include: {
        menu: true,
      },
    });

    const menus = roleMenus.map((rm) => rm.menu);
    return this.buildMenuTree(menus);
  }

  // 检查用户是否有权限访问特定菜单
  async checkMenuPermission(userId: number, menuId: number): Promise<boolean> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map((ur) => ur.roleId);

    const roleMenu = await this.prisma.roleMenu.findFirst({
      where: {
        menuId,
        roleId: {
          in: roleIds,
        },
      },
    });

    return !!roleMenu;
  }
}
