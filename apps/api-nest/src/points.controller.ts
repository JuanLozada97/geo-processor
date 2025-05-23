import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProcessRequest, ProcessResponse } from '@geo/dto';

@Controller('points')
@UseInterceptors(CacheInterceptor)
export class PointsController {
  constructor(private readonly http: HttpService) {}

  @Post()
  async process(
    @Body() body: ProcessRequest
  ): Promise<ProcessResponse> {
    if (!Array.isArray(body.points) || !body.points.length) {
      throw new BadRequestException('points must be a non-empty array');
    }
    const fastApiURL = process.env.PY_URL ?? 'http://localhost:8000';
    const { data } = await firstValueFrom(
      this.http.post<ProcessResponse>(
        `${fastApiURL}/process`,
        body
      )
    );
    return data;
  }
}
