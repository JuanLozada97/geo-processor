import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { PointsController } from './points.controller';

@Module({
  imports: [
    CacheModule.register(),  
    HttpModule,
  ],
  controllers: [PointsController],
})
export class AppModule {}
