import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarcasService } from './marcas.service.js';
import type { DrizzleDatabase } from '../../database/database.module.js';

describe('MarcasService', () => {
  let service: MarcasService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
    };
    service = new MarcasService(mockDb as DrizzleDatabase);
  });

  it('debe listar todas las marcas activas ordenadas alfabéticamente', async () => {
    const mockMarcas = [
      { id: 1, descripcion: 'AUDI', esAltaGama: true, activo: true },
      { id: 2, descripcion: 'FORD', esAltaGama: false, activo: true },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockMarcas),
        }),
      }),
    });

    const marcas = await service.obtenerTodas();
    expect(marcas).toEqual(mockMarcas);
  });

  it('debe obtener una marca por su descripción y verificar esAltaGama', async () => {
    const mockBmw = { id: 1, descripcion: 'BMW', esAltaGama: true, activo: true };

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockBmw]),
        }),
      }),
    });

    const resultado = await service.obtenerPorDescripcion('BMW');
    expect(resultado).toEqual(mockBmw);
    expect(resultado?.esAltaGama).toBe(true);
  });
});
