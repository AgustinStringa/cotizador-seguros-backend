import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MarcasService } from './marcas.service.js';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Get()
  obtenerTodas() {
    return this.marcasService.obtenerTodas();
  }

  @Get(':nombre')
  async obtenerPorNombre(@Param('nombre') nombre: string) {
    const marca = await this.marcasService.obtenerPorDescripcion(nombre);
    if (!marca) {
      throw new NotFoundException(`Marca "${nombre}" no encontrada`);
    }
    return marca;
  }
}
