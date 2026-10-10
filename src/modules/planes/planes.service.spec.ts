import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlanesService } from './planes.service.js';
import type { DrizzleDatabase } from '../../database/database.module.js';

describe('PlanesService', () => {
  let service: PlanesService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
    };
    service = new PlanesService(mockDb as DrizzleDatabase);
  });

  it('debe devolver planes desde la base de datos si existen registros', async () => {
    const planesMock = [
      {
        id: 1,
        codigo: 'basico',
        nombre: 'Plan Básico',
        recargoPorcentaje: '20.00',
        descripcion: 'Cobertura esencial',
        activo: true,
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(planesMock),
      }),
    });

    const result = await service.obtenerTodos();
    expect(result).toEqual(planesMock);
  });

  it('debe devolver un arreglo vacío si la base de datos no tiene planes', async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    const result = await service.obtenerTodos();
    expect(result).toEqual([]);
  });

  it('debe devolver un plan por su código si existe en la base de datos', async () => {
    const planMock = {
      id: 1,
      codigo: 'basico',
      nombre: 'Plan Básico',
      recargoPorcentaje: '20.00',
      descripcion: 'Cobertura esencial',
      activo: true,
    };

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([planMock]),
        }),
      }),
    });

    const result = await service.obtenerPorCodigo('basico');
    expect(result).toEqual(planMock);
  });

  it('debe lanzar NotFoundException si el plan no existe en la base de datos', async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    await expect(service.obtenerPorCodigo('inexistente')).rejects.toThrow(
      'Plan con código "inexistente" no encontrado',
    );
  });
});
