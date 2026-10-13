import { Module } from '@nestjs/common';
import { PlanesController } from './planes.controller.js';
import { PlanesService } from './planes.service.js';
import { PlanesRepository } from './repositories/planes.repository.js';

@Module({
  controllers: [PlanesController],
  providers: [PlanesRepository, PlanesService],
  exports: [PlanesService, PlanesRepository],
})
export class PlanesModule {}
