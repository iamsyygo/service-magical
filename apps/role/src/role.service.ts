import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  // 创建角色
  async create(createRoleDto: CreateRoleDto) {
    const { menuIds, ...roleData } = createRoleDto;

    return this.prisma.$transaction(async (tx) => {
      // 创建角色
      const role = await tx.role.create({
        data: roleData,
      });

      // 如果有菜单权限，创建角色-菜单关联
      if (menuIds?.length) {
        await tx.roleMenu.createMany({
          data: menuIds.map((menuId) => ({
            roleId: role.id,
            menuId,
          })),
        });
      }

      return role;
    });
  }

  // 获取角色列表
  async findAll(query: {
    page?: number;
    pageSize?: number;
    name?: string;
    status?: boolean;
  }) {
    const { page = 1, pageSize = 10, name, status } = query;
    const where = {
      ...(name && { name: { contains: name } }),
      ...(typeof status !== 'undefined' && { status }),
    };

    const [total, items] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          menus: {
            include: {
              menu: true,
            },
          },
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  // 获取角色详情
  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        menus: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  // 更新角色
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { menuIds, ...roleData } = updateRoleDto;

    return this.prisma.$transaction(async (tx) => {
      // 更新角色基本信息
      const role = await tx.role.update({
        where: { id },
        data: roleData,
      });

      // 如果更新了菜单权限
      if (menuIds) {
        // 删除原有的角色-菜单关联
        await tx.roleMenu.deleteMany({
          where: { roleId: id },
        });

        // 创建新的角色-菜单关联
        if (menuIds.length) {
          await tx.roleMenu.createMany({
            data: menuIds.map((menuId) => ({
              roleId: id,
              menuId,
            })),
          });
        }
      }

      return role;
    });
  }

  // 删除角色
  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      // 删除角色-菜单关联
      await tx.roleMenu.deleteMany({
        where: { roleId: id },
      });

      // 删除用户-角色关联
      await tx.userRole.deleteMany({
        where: { roleId: id },
      });

      // 删除角色
      return tx.role.delete({
        where: { id },
      });
    });
  }

  // 分配角色给用户
  async assignRoleToUsers(roleId: number, userIds: number[]) {
    // 先检查角色是否存在
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return this.prisma.userRole.createMany({
      data: userIds.map((userId) => ({
        roleId,
        userId,
      })),
      skipDuplicates: true, // 跳过已存在的关联
    });
  }

  // 移除用户的角色
  async removeRoleFromUsers(roleId: number, userIds: number[]) {
    return this.prisma.userRole.deleteMany({
      where: {
        roleId,
        userId: {
          in: userIds,
        },
      },
    });
  }
}
