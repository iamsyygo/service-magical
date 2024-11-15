import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';

async function bootstrap() {
  const app = await NestFactory.create(RoleModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
