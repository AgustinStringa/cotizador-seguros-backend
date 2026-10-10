import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AniosService } from './anios.service.js';

@Controller('anios')
export class AniosController {
  constructor(private readonly aniosService: AniosService) {}

  @Get()
  obtenerTodos() {
    return this.aniosService.obtenerTodos();
  }

  @Get(':anio')
  obtenerPorAnio(@Param('anio', ParseIntPipe) anio: number) {
    return this.aniosService.obtenerPorAnio(anio);
  }
}
