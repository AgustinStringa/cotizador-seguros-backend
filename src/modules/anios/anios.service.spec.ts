import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AniosService } from './anios.service.js';
import type { AniosRepository } from './repositories/anios.repository.js';

describe('AniosService', () => {
  let service: AniosService;
  let mockRepository: Partial<AniosRepository>;

  beforeEach(() => {
    mockRepository = {
      obtenerActivosOrdenados: vi.fn(),
      obtenerPorAnio: vi.fn(),
    };
    service = new AniosService(mockRepository as AniosRepository);
  });

  it('debe devolver años ordenados descendentemente desde el repositorio si existen registros', async () => {
    const aniosMock = [
      {
        id: 1,
        anio: 2026,
        factorDepreciacion: '1.0000',
        descripcion: 'Vehículos fabricados en el año 2026',
        activo: true,
      },
      {
        id: 2,
        anio: 2025,
        factorDepreciacion: '0.9700',
        descripcion: 'Vehículos fabricados en el año 2025',
        activo: true,
      },
    ];

    (mockRepository.obtenerActivosOrdenados as any).mockResolvedValue(aniosMock);

    const result = await service.obtenerTodos();
    expect(result).toEqual(aniosMock);
    expect(mockRepository.obtenerActivosOrdenados).toHaveBeenCalledTimes(1);
  });

  it('debe devolver un arreglo vacío si el repositorio no tiene años', async () => {
    (mockRepository.obtenerActivosOrdenados as any).mockResolvedValue([]);

    const result = await service.obtenerTodos();
    expect(result).toEqual([]);
  });

  it('debe devolver un año específico si existe en el repositorio', async () => {
    const anioMock = {
      id: 1,
      anio: 2024,
      factorDepreciacion: '0.9400',
      descripcion: 'Vehículos fabricados en el año 2024',
      activo: true,
    };

    (mockRepository.obtenerPorAnio as any).mockResolvedValue(anioMock);

    const result = await service.obtenerPorAnio(2024);
    expect(result).toEqual(anioMock);
    expect(mockRepository.obtenerPorAnio).toHaveBeenCalledWith(2024);
  });

  it('debe lanzar NotFoundException si el año no existe en el repositorio', async () => {
    (mockRepository.obtenerPorAnio as any).mockResolvedValue(null);

    await expect(service.obtenerPorAnio(1990)).rejects.toThrow(
      'Año "1990" no encontrado',
    );
  });

  it('debe lanzar NotFoundException si se pasa un año que no es número', async () => {
    await expect(service.obtenerPorAnio(NaN)).rejects.toThrow(
      'Año "NaN" no válido',
    );
  });
});
