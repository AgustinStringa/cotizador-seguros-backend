import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CotizacionesService } from '../services/cotizaciones.service.js';
import { CalcularCotizacionDto } from '../dto/calcular-cotizacion.dto.js';
import { CrearCotizacionDto } from '../dto/crear-cotizacion.dto.js';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post('calcular')
  @HttpCode(HttpStatus.OK)
  calcular(@Body() dto: CalcularCotizacionDto) {
    return this.cotizacionesService.calcular(dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearCotizacionDto) {
    return this.cotizacionesService.crear(dto);
  }

  @Get()
  listar(@Query() paginationDto: PaginationDto) {
    return this.cotizacionesService.listar(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.obtenerPorId(id);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.eliminar(id);
  }
}
