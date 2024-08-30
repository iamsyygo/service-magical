import { Controller, Get, Param, Patch } from '@nestjs/common';
import { QuickBuildService } from './quick-build.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnwantedAuthenticate } from '@app/common/decorator/unwanted-authenticate.decorator';

@ApiTags('快速构建相关模块')
@Controller('quick-build')
export class QuickBuildController {
  constructor(private readonly quickBuildService: QuickBuildService) {}

  @ApiOperation({ summary: '获取数据库表' })
  @UnwantedAuthenticate()
  @Get('tables')
  async getDatabaseTables() {
    return this.quickBuildService.getDatabaseTables();
  }

  @ApiOperation({ summary: '获取表字段' })
  @UnwantedAuthenticate()
  @Patch('columns/:tableName')
  async getColumnWithTable(@Param('tableName') tableName: string) {
    return this.quickBuildService.getColumnWithTable(tableName);
  }
}
