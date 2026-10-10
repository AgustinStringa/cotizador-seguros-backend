import { Module } from '@nestjs/common';
import { AniosController } from './anios.controller.js';
import { AniosService } from './anios.service.js';

@Module({
  controllers: [AniosController],
  providers: [AniosService],
  exports: [AniosService],
})
export class AniosModule {}
