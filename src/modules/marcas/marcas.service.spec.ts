import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarcasService } from './marcas.service.js';
import type { MarcasRepository } from './repositories/marcas.repository.js';

describe('MarcasService', () => {
  let service: MarcasService;
  let mockRepository: Partial<MarcasRepository>;

  beforeEach(() => {
    mockRepository = {
      obtenerActivasOrdenadas: vi.fn(),
      obtenerPorDescripcion: vi.fn(),
    };
    service = new MarcasService(mockRepository as MarcasRepository);
  });

  it('debe listar todas las marcas activas ordenadas alfabéticamente desde el repositorio', async () => {
    const mockMarcas = [
      { id: 1, descripcion: 'AUDI', esAltaGama: true, activo: true },
      { id: 2, descripcion: 'FORD', esAltaGama: false, activo: true },
    ];

    (mockRepository.obtenerActivasOrdenadas as any).mockResolvedValue(mockMarcas);

    const marcas = await service.obtenerTodas();
    expect(marcas).toEqual(mockMarcas);
    expect(mockRepository.obtenerActivasOrdenadas).toHaveBeenCalledTimes(1);
  });

  it('debe obtener una marca por su descripción y verificar esAltaGama', async () => {
    const mockBmw = { id: 1, descripcion: 'BMW', esAltaGama: true, activo: true };

    (mockRepository.obtenerPorDescripcion as any).mockResolvedValue(mockBmw);

    const resultado = await service.obtenerPorDescripcion('BMW');
    expect(resultado).toEqual(mockBmw);
    expect(resultado?.esAltaGama).toBe(true);
    expect(mockRepository.obtenerPorDescripcion).toHaveBeenCalledWith('BMW');
  });
});
