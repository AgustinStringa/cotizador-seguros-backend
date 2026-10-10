import { Inject, Injectable } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../database/database.module.js';
import * as schema from '../../database/schema/index.js';
import type { Marca } from '../../database/schema/marcas.schema.js';

export type MarcaItem = Marca;

@Injectable()
export class MarcasService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: DrizzleDatabase,
  ) {}

  async obtenerTodas(): Promise<Marca[]> {
    return this.db
      .select()
      .from(schema.marcas)
      .where(eq(schema.marcas.activo, true))
      .orderBy(asc(schema.marcas.descripcion));
  }

  async obtenerPorDescripcion(descripcion: string): Promise<Marca | undefined> {
    const buscada = descripcion.trim().toUpperCase();
    const resultados = await this.db
      .select()
      .from(schema.marcas)
      .where(eq(schema.marcas.descripcion, buscada))
      .limit(1);

    return resultados[0];
  }
}
