import { Module } from '@nestjs/common';
import { MarcasController } from './marcas.controller.js';
import { MarcasService } from './marcas.service.js';

@Module({
  controllers: [MarcasController],
  providers: [MarcasService],
  exports: [MarcasService],
})
export class MarcasModule {}
