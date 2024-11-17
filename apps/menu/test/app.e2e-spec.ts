import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MenuModule } from './../src/menu.module';
import { PrismaService } from '@app/prisma';
import { MenuType } from '@prisma/client';

describe('MenuController (e2e)', () => {
  let app: INestApplication;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MenuModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        menu: {
          create: jest.fn().mockResolvedValue(mockMenu),
          findMany: jest.fn().mockResolvedValue([mockMenu]),
          findUnique: jest.fn().mockResolvedValue(mockMenu),
          update: jest.fn().mockResolvedValue(mockMenu),
          delete: jest.fn().mockResolvedValue(mockMenu),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/menu (POST)', () => {
    return request(app.getHttpServer())
      .post('/menu')
      .send({
        name: '系统管理',
        type: MenuType.DIRECTORY,
      })
      .expect(201)
      .expect(mockMenu);
  });

  it('/menu/tree (GET)', () => {
    return request(app.getHttpServer())
      .get('/menu/tree')
      .expect(200)
      .expect([mockMenu]);
  });

  it('/menu/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/menu/1')
      .expect(200)
      .expect(mockMenu);
  });

  it('/menu/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/menu/1')
      .send({ name: '更新后的菜单' })
      .expect(200)
      .expect(mockMenu);
  });

  it('/menu/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/menu/1')
      .expect(200)
      .expect(mockMenu);
  });
});
