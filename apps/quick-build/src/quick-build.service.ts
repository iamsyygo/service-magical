import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuickBuildService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  redisService: RedisService;

  @Inject(ConfigService)
  private configService: ConfigService;

  // 获取表
  getDatabaseTables() {
    const schema = this.configService.get('DATABASE_TABLE_BRANCH');
    if (!schema) {
      throw new Error('DATABASE_TABLE_BRANCH is required');
    }
    return this.prismaService.$queryRaw`
    SELECT
        TB.TABLE_SCHEMA as tableBranch,
        TB.TABLE_NAME as tableName,
        TB.TABLE_COMMENT as tableComment,
        TB.CREATE_TIME as createTime,
        TB.UPDATE_TIME as updateTime
    FROM
        INFORMATION_SCHEMA.TABLES TB
    Where TB.TABLE_SCHEMA =${schema}
  `;
  }

  // 根据表获取字段信息
  getColumnWithTable(tableName: string) {
    const schema = this.configService.get('DATABASE_TABLE_BRANCH');
    if (!schema) {
      throw new Error('DATABASE_TABLE_BRANCH is required');
    }
    return this.prismaService.$queryRaw`
      SELECT
          TB.TABLE_SCHEMA as tableSchema,
          TB.TABLE_NAME as tableName,
          TB.TABLE_COMMENT as tableComment,
          COL.COLUMN_NAME as columnName,
          COL.COLUMN_TYPE as columnType,
          COL.COLUMN_COMMENT as columnComment,
          COL.DATA_TYPE as dataType,
          -- COL.IS_NULLABLE as isNull,
          COL.CHARACTER_MAXIMUM_LENGTH as characterMaximumLength,
          COL.COLUMN_KEY as columnKey,
          @columnnum := @columnnum + 1 as columnIndex,
          @rownum := @rownum + 0 as rowIndex,
          CASE
            WHEN COL.IS_NULLABLE = 'YES' THEN 1
            ELSE 0
          END as isNull
      FROM
          (SELECT @columnnum := 1) c, -- 初始化列计数器
          (SELECT @rownum := 1) r, -- 初始化行计数器
          INFORMATION_SCHEMA.TABLES TB
      JOIN
          INFORMATION_SCHEMA.COLUMNS COL
      ON
          TB.TABLE_SCHEMA = COL.TABLE_SCHEMA
      AND
          TB.TABLE_NAME = COL.TABLE_NAME
      WHERE
          TB.TABLE_SCHEMA = ${schema}
      AND
          TB.TABLE_NAME = ${tableName}
    `;
  }
}
