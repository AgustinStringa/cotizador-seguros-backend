import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanesRepository } from './repositories/planes.repository.js';
import type { Plan } from '../../database/schema/planes.schema.js';

@Injectable()
export class PlanesService {
  constructor(private readonly planesRepository: PlanesRepository) {}

  async obtenerTodos(): Promise<Plan[]> {
    return this.planesRepository.obtenerActivos();
  }

  async obtenerPorCodigo(codigo: string): Promise<Plan> {
    const plan = await this.planesRepository.obtenerPorCodigo(codigo);
    if (!plan) {
      throw new NotFoundException(`Plan con código "${codigo}" no encontrado`);
    }
    return plan;
  }
}
