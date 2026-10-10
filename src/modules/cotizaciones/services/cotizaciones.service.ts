import { Injectable, NotFoundException } from '@nestjs/common';
import { CotizacionesRepository } from '../repositories/cotizaciones.repository.js';
import { PlanesService } from '../../planes/planes.service.js';
import { MarcasService } from '../../marcas/marcas.service.js';
import { CalcularCotizacionDto } from '../dto/calcular-cotizacion.dto.js';
import { CrearCotizacionDto } from '../dto/crear-cotizacion.dto.js';
import type { CotizacionCalculadaDto } from '../dto/cotizacion-response.dto.js';
import type { Cotizacion } from '../../../database/schema/cotizaciones.schema.js';

@Injectable()
export class CotizacionesService {
  constructor(
    private readonly cotizacionesRepository: CotizacionesRepository,
    private readonly planesService: PlanesService,
    private readonly marcasService: MarcasService,
  ) {}

  async calcular(dto: CalcularCotizacionDto): Promise<CotizacionCalculadaDto> {
    const { marca, anio, tipoPlan } = dto;
    const plan = await this.planesService.obtenerPorCodigo(tipoPlan);

    // Consulta la marca en base de datos para verificar si es de alta gama
    const marcaInfo = await this.marcasService.obtenerPorDescripcion(marca);
    const esAltaGama = Boolean(marcaInfo?.esAltaGama);
    const factorMarca = esAltaGama ? 1.7 * 1.3 : 1.3;

    const currentYear = new Date().getFullYear();
    const diferenciaAnios = Math.max(0, currentYear - anio);
    const porcentajeAnio = Math.max(0, 100 - diferenciaAnios * 3);
    const factorAnio = porcentajeAnio / 100;

    const recargoPlan = Number(plan.recargoPorcentaje);
    const factorPlan = Number((1 + recargoPlan / 100).toFixed(4));

    // El precio base es un dato obtenido directamente de la entidad PLAN
    const precioBase = Number(plan.precioBase);

    let precio = precioBase;
    // 1. Aumento por marca
    precio = precio * factorMarca;
    // 2. Depreciación por año
    if (diferenciaAnios > 0) {
      precio = (porcentajeAnio * precio) / 100;
    }
    // 3. Aumento por plan dinámico según la entidad
    precio = ((100 + recargoPlan) * precio) / 100;

    const precioFinal = Number(precio.toFixed(2));

    return {
      marca: dto.marca,
      anio: dto.anio,
      tipoPlan: plan.codigo,
      precioBase,
      factorMarca: Number(factorMarca.toFixed(4)),
      factorAnio: Number(factorAnio.toFixed(4)),
      factorPlan,
      precioFinal,
    };
  }

  async crear(dto: CrearCotizacionDto): Promise<Cotizacion> {
    const calculo = await this.calcular(dto);

    return this.cotizacionesRepository.create({
      marca: calculo.marca,
      anio: calculo.anio,
      tipoPlan: calculo.tipoPlan,
      precioBase: calculo.precioBase.toFixed(2),
      factorMarca: calculo.factorMarca.toFixed(4),
      factorAnio: calculo.factorAnio.toFixed(4),
      factorPlan: calculo.factorPlan.toFixed(4),
      precioFinal: calculo.precioFinal.toFixed(2),
    });
  }

  async listar(page = 1, limit = 10) {
    return this.cotizacionesRepository.findAll(page, limit);
  }

  async obtenerPorId(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionesRepository.findById(id);
    if (!cotizacion) {
      throw new NotFoundException(`Cotización con id ${id} no encontrada`);
    }
    return cotizacion;
  }

  async eliminar(id: number): Promise<{ eliminado: boolean }> {
    const eliminada = await this.cotizacionesRepository.delete(id);
    if (!eliminada) {
      throw new NotFoundException(`Cotización con id ${id} no encontrada para eliminar`);
    }
    return { eliminado: true };
  }
}
