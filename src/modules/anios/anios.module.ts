import { Module } from '@nestjs/common';
import { AniosController } from './anios.controller.js';
import { AniosService } from './anios.service.js';
import { AniosRepository } from './repositories/anios.repository.js';

@Module({
  controllers: [AniosController],
  providers: [AniosRepository, AniosService],
  exports: [AniosService, AniosRepository],
})
export class AniosModule {}
