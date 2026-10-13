import { Module } from '@nestjs/common';
import { MarcasController } from './marcas.controller.js';
import { MarcasService } from './marcas.service.js';
import { MarcasRepository } from './repositories/marcas.repository.js';

@Module({
  controllers: [MarcasController],
  providers: [MarcasRepository, MarcasService],
  exports: [MarcasService, MarcasRepository],
})
export class MarcasModule {}
