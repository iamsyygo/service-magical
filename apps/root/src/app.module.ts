import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceNames } from 'shared/enums/microservice-names.enum';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MicroserviceNames.USER,
        transport: Transport.TCP,
        options: {
          port: 8089,
        },
      },
    ]),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
