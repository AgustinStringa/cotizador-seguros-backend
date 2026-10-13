import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlanesService } from './planes.service.js';
import type { PlanesRepository } from './repositories/planes.repository.js';

describe('PlanesService', () => {
  let service: PlanesService;
  let mockRepository: Partial<PlanesRepository>;

  beforeEach(() => {
    mockRepository = {
      obtenerActivos: vi.fn(),
      obtenerPorCodigo: vi.fn(),
    };
    service = new PlanesService(mockRepository as PlanesRepository);
  });

  it('debe devolver planes desde el repositorio si existen registros', async () => {
    const planesMock = [
      {
        id: 1,
        codigo: 'basico',
        nombre: 'Plan Básico',
        precioBase: '350.00',
        recargoPorcentaje: '20.00',
        descripcion: 'Cobertura esencial',
        activo: true,
      },
    ];

    (mockRepository.obtenerActivos as any).mockResolvedValue(planesMock);

    const result = await service.obtenerTodos();
    expect(result).toEqual(planesMock);
    expect(mockRepository.obtenerActivos).toHaveBeenCalledTimes(1);
  });

  it('debe devolver un arreglo vacío si el repositorio no tiene planes', async () => {
    (mockRepository.obtenerActivos as any).mockResolvedValue([]);

    const result = await service.obtenerTodos();
    expect(result).toEqual([]);
  });

  it('debe devolver un plan por su código si existe en el repositorio', async () => {
    const planMock = {
      id: 1,
      codigo: 'basico',
      nombre: 'Plan Básico',
      precioBase: '350.00',
      recargoPorcentaje: '20.00',
      descripcion: 'Cobertura esencial',
      activo: true,
    };

    (mockRepository.obtenerPorCodigo as any).mockResolvedValue(planMock);

    const result = await service.obtenerPorCodigo('basico');
    expect(result).toEqual(planMock);
    expect(mockRepository.obtenerPorCodigo).toHaveBeenCalledWith('basico');
  });

  it('debe lanzar NotFoundException si el plan no existe en el repositorio', async () => {
    (mockRepository.obtenerPorCodigo as any).mockResolvedValue(null);

    await expect(service.obtenerPorCodigo('inexistente')).rejects.toThrow(
      'Plan con código "inexistente" no encontrado',
    );
  });
});
