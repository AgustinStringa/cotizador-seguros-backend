import { Injectable } from '@nestjs/common';
import { MarcasRepository } from './repositories/marcas.repository.js';
import type { Marca } from '../../database/schema/marcas.schema.js';

export type MarcaItem = Marca;

@Injectable()
export class MarcasService {
  constructor(private readonly marcasRepository: MarcasRepository) {}

  async obtenerTodas(): Promise<Marca[]> {
    return this.marcasRepository.obtenerActivasOrdenadas();
  }

  async obtenerPorDescripcion(descripcion: string): Promise<Marca | undefined> {
    const marca = await this.marcasRepository.obtenerPorDescripcion(descripcion);
    return marca ?? undefined;
  }
}
