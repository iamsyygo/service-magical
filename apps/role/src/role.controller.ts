import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('角色管理')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '获取角色列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'name', required: false, description: '角色名称' })
  @ApiQuery({ name: 'status', required: false, description: '状态' })
  @Get()
  findAll(
    @Query()
    query: {
      page?: number;
      pageSize?: number;
      name?: string;
      status?: boolean;
    },
  ) {
    return this.roleService.findAll(query);
  }

  @ApiOperation({ summary: '获取角色详情' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

  @ApiOperation({ summary: '分配用户' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiBody({
    schema: {
      properties: { userIds: { type: 'array', items: { type: 'number' } } },
    },
  })
  @Post(':id/users')
  assignUsers(@Param('id') id: string, @Body() data: { userIds: number[] }) {
    return this.roleService.assignRoleToUsers(+id, data.userIds);
  }

  @ApiOperation({ summary: '移除用户' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiBody({
    schema: {
      properties: { userIds: { type: 'array', items: { type: 'number' } } },
    },
  })
  @Delete(':id/users')
  removeUsers(@Param('id') id: string, @Body() data: { userIds: number[] }) {
    return this.roleService.removeRoleFromUsers(+id, data.userIds);
  }
}
