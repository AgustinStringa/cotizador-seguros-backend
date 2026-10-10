import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AniosService } from './anios.service.js';
import type { DrizzleDatabase } from '../../database/database.module.js';

describe('AniosService', () => {
  let service: AniosService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
    };
    service = new AniosService(mockDb as DrizzleDatabase);
  });

  it('debe devolver años ordenados descendentemente desde la base de datos si existen registros', async () => {
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

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(aniosMock),
        }),
      }),
    });

    const result = await service.obtenerTodos();
    expect(result).toEqual(aniosMock);
  });

  it('debe devolver un arreglo vacío si la base de datos no tiene años', async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await service.obtenerTodos();
    expect(result).toEqual([]);
  });

  it('debe devolver un año específico si existe en la base de datos', async () => {
    const anioMock = {
      id: 1,
      anio: 2024,
      factorDepreciacion: '0.9400',
      descripcion: 'Vehículos fabricados en el año 2024',
      activo: true,
    };

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([anioMock]),
        }),
      }),
    });

    const result = await service.obtenerPorAnio(2024);
    expect(result).toEqual(anioMock);
  });

  it('debe lanzar NotFoundException si el año no existe en la base de datos', async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

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
