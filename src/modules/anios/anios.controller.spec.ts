import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AniosController } from './anios.controller.js';
import { AniosService } from './anios.service.js';

describe('AniosController', () => {
  let controller: AniosController;
  let mockService: Partial<AniosService>;

  beforeEach(() => {
    mockService = {
      obtenerTodos: vi.fn(),
      obtenerPorAnio: vi.fn(),
    };
    controller = new AniosController(mockService as AniosService);
  });

  it('debe llamar a obtenerTodos del servicio', async () => {
    const aniosMock = [
      {
        id: 1,
        anio: 2026,
        factorDepreciacion: '1.0000',
        descripcion: 'Vehículos fabricados en el año 2026',
        activo: true,
      },
    ];
    (mockService.obtenerTodos as any).mockResolvedValue(aniosMock);

    const result = await controller.obtenerTodos();
    expect(result).toEqual(aniosMock);
    expect(mockService.obtenerTodos).toHaveBeenCalled();
  });

  it('debe llamar a obtenerPorAnio con el parámetro numérico', async () => {
    const anioMock = {
      id: 1,
      anio: 2024,
      factorDepreciacion: '0.9400',
      descripcion: 'Vehículos fabricados en el año 2024',
      activo: true,
    };
    (mockService.obtenerPorAnio as any).mockResolvedValue(anioMock);

    const result = await controller.obtenerPorAnio(2024);
    expect(result).toEqual(anioMock);
    expect(mockService.obtenerPorAnio).toHaveBeenCalledWith(2024);
  });
});
