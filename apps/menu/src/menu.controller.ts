import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UnwantedAuthenticate } from '@app/common/decorator/unwanted-authenticate.decorator';

@ApiTags('菜单管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get('tree')
  @UnwantedAuthenticate()
  @ApiOperation({ summary: '获取菜单树' })
  getMenuTree() {
    return this.menuService.getMenuTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个菜单' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: Partial<CreateMenuDto>,
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }

  @ApiOperation({ summary: '获取用户菜单权限' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @Get('user/:userId')
  getUserMenus(@Param('userId', ParseIntPipe) userId: number) {
    return this.menuService.getUserMenus(userId);
  }

  @ApiOperation({ summary: '获取角色菜单权限' })
  @ApiParam({ name: 'roleId', description: '角色ID' })
  @Get('role/:roleId')
  getRoleMenus(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.menuService.getRoleMenus(roleId);
  }

  @ApiOperation({ summary: '检查用户菜单权限' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiParam({ name: 'menuId', description: '菜单ID' })
  @Get('check/:userId/:menuId')
  checkMenuPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.checkMenuPermission(userId, menuId);
  }
}
