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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
}
