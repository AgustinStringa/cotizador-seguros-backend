import { Injectable, NotFoundException } from '@nestjs/common';
import { AniosRepository } from './repositories/anios.repository.js';
import type { Anio } from '../../database/schema/anios.schema.js';

@Injectable()
export class AniosService {
  constructor(private readonly aniosRepository: AniosRepository) {}

  async obtenerTodos(): Promise<Anio[]> {
    return this.aniosRepository.obtenerActivosOrdenados();
  }

  async obtenerPorAnio(anio: number): Promise<Anio> {
    const anioNumero = Number(anio);
    if (isNaN(anioNumero)) {
      throw new NotFoundException(`Año "${anio}" no válido`);
    }

    const resultado = await this.aniosRepository.obtenerPorAnio(anioNumero);
    if (!resultado) {
      throw new NotFoundException(`Año "${anio}" no encontrado`);
    }

    return resultado;
  }
}
