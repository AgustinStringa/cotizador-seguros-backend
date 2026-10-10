import { Controller, Get, Param } from '@nestjs/common';
import { PlanesService } from './planes.service.js';

@Controller('planes')
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @Get()
  obtenerTodos() {
    return this.planesService.obtenerTodos();
  }

  @Get(':codigo')
  obtenerPorCodigo(@Param('codigo') codigo: string) {
    return this.planesService.obtenerPorCodigo(codigo);
  }
}
