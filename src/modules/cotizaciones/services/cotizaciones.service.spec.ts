import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CotizacionesService } from './cotizaciones.service.js';
import { CotizacionesRepository } from '../repositories/cotizaciones.repository.js';
import { PlanesService } from '../../planes/planes.service.js';
import { MarcasService } from '../../marcas/marcas.service.js';

describe('CotizacionesService', () => {
  let service: CotizacionesService;
  let mockRepository: Partial<CotizacionesRepository>;
  let mockPlanesService: Partial<PlanesService>;
  let mockMarcasService: Partial<MarcasService>;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };
    mockPlanesService = {
      obtenerPorCodigo: vi.fn().mockImplementation(async (codigo: string) => {
        if (codigo === 'basico') {
          return {
            id: 1,
            codigo: 'basico',
            nombre: 'Plan Básico',
            precioBase: '350.00',
            recargoPorcentaje: '20.00',
            descripcion: 'Cobertura básica',
            activo: true,
          };
        }
        if (codigo === 'completo') {
          return {
            id: 2,
            codigo: 'completo',
            nombre: 'Plan Completo',
            precioBase: '700.00',
            recargoPorcentaje: '50.00',
            descripcion: 'Cobertura total',
            activo: true,
          };
        }
        throw new Error(`Plan ${codigo} no encontrado`);
      }),
    };
    mockMarcasService = {
      obtenerPorDescripcion: vi.fn().mockImplementation(async (descripcion: string) => {
        const marcasAltaGama = ['BMW', 'AUDI'];
        const esAltaGama = marcasAltaGama.includes(descripcion.trim().toUpperCase());
        return {
          id: 1,
          descripcion,
          esAltaGama,
          activo: true,
        };
      }),
    };
    service = new CotizacionesService(
      mockRepository as CotizacionesRepository,
      mockPlanesService as PlanesService,
      mockMarcasService as MarcasService,
    );
  });

  describe('calcular', () => {
    const currentYear = new Date().getFullYear();

    it('debe calcular correctamente para una marca estándar y plan básico en el año actual con precioBase de 350', async () => {
      const result = await service.calcular({
        marca: 'FORD',
        anio: currentYear,
        tipoPlan: 'basico',
      });

      // Base del plan: 350
      // Marca estándar: 350 * 1.3 = 455
      // Diferencia años: 0 -> 455
      // Plan básico (+20%): 455 * 1.2 = 546.00
      expect(result.precioBase).toBe(350);
      expect(result.factorMarca).toBe(1.3);
      expect(result.factorAnio).toBe(1);
      expect(result.factorPlan).toBe(1.2);
      expect(result.precioFinal).toBe(546);
    });

    it('debe calcular correctamente para una marca de alta gama (en DB) y plan completo con precioBase de 700', async () => {
      const result = await service.calcular({
        marca: 'BMW',
        anio: currentYear,
        tipoPlan: 'completo',
      });

      // Base del plan: 700
      // Marca alta gama: 700 * 1.7 * 1.3 = 1547
      // Plan completo (+50%): 1547 * 1.5 = 2320.50
      expect(result.precioBase).toBe(700);
      expect(result.factorMarca).toBe(2.21);
      expect(result.factorPlan).toBe(1.5);
      expect(result.precioFinal).toBe(2320.5);
    });

    it('debe aplicar la depreciación anual del 3% por año de antigüedad', async () => {
      const result = await service.calcular({
        marca: 'FORD',
        anio: currentYear - 5, // 5 años de diferencia => 15% descuento => 85%
        tipoPlan: 'basico',
      });

      // Base: 350 * 1.3 = 455
      // 85% de 455 = 386.75
      // Plan básico (+20%): 386.75 * 1.2 = 464.10
      expect(result.precioBase).toBe(350);
      expect(result.factorAnio).toBe(0.85);
      expect(result.precioFinal).toBe(464.1);
    });
  });

  describe('crear y persistir', () => {
    it('debe calcular y llamar a repository.create con los valores calculados', async () => {
      const currentYear = new Date().getFullYear();
      const mockSaved = {
        id: 1,
        marca: 'FIAT',
        anio: currentYear,
        tipoPlan: 'basico',
        precioBase: '350.00',
        factorMarca: '1.3000',
        factorAnio: '1.0000',
        factorPlan: '1.2000',
        precioFinal: '546.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockRepository.create as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockSaved,
      );

      const result = await service.crear({
        marca: 'FIAT',
        anio: currentYear,
        tipoPlan: 'basico',
      });

      expect(mockRepository.create).toHaveBeenCalledOnce();
      expect(result).toEqual(mockSaved);
    });
  });
});
