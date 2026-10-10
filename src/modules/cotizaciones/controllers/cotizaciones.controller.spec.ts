import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CotizacionesController } from './cotizaciones.controller.js';
import { CotizacionesService } from '../services/cotizaciones.service.js';

describe('CotizacionesController', () => {
  let controller: CotizacionesController;
  let mockService: Partial<CotizacionesService>;

  beforeEach(() => {
    mockService = {
      calcular: vi.fn(),
      crear: vi.fn(),
      listar: vi.fn(),
      obtenerPorId: vi.fn(),
      eliminar: vi.fn(),
    };
    controller = new CotizacionesController(
      mockService as CotizacionesService,
    );
  });

  it('debe llamar a calcular en el servicio al hacer POST /calcular', () => {
    const dto = {
      marca: 'AUDI',
      anio: 2024,
      tipoPlan: 'completo' as const,
    };
    const expected = {
      marca: 'AUDI',
      anio: 2024,
      tipoPlan: 'completo' as const,
      precioBase: 2000,
      factorMarca: 2.21,
      factorAnio: 0.94,
      factorPlan: 1.5,
      precioFinal: 6232.2,
    };

    (mockService.calcular as ReturnType<typeof vi.fn>).mockReturnValue(expected);

    const result = controller.calcular(dto);
    expect(mockService.calcular).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('debe listar cotizaciones con paginación', async () => {
    const paginated = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
    (mockService.listar as ReturnType<typeof vi.fn>).mockResolvedValue(paginated);

    const result = await controller.listar({ page: 1, limit: 10 });
    expect(mockService.listar).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(paginated);
  });
});
