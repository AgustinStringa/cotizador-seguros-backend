import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@shared/backend';
import { eq, asc } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../../database/database.module.js';
import * as schema from '../../../database/schema/index.js';
import type {
  Marca,
  NuevaMarca,
} from '../../../database/schema/marcas.schema.js';

@Injectable()
export class MarcasRepository extends BaseRepository<
  Marca,
  NuevaMarca,
  DrizzleDatabase
> {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    db: DrizzleDatabase,
  ) {
    super(db, schema.marcas, {
      idColumn: schema.marcas.id,
      orderByColumn: schema.marcas.descripcion,
      orderDirection: 'asc',
      entityName: 'la marca',
    });
  }

  async obtenerActivasOrdenadas(): Promise<Marca[]> {
    return this.db
      .select()
      .from(schema.marcas)
      .where(eq(schema.marcas.activo, true))
      .orderBy(asc(schema.marcas.descripcion));
  }

  async obtenerPorDescripcion(descripcion: string): Promise<Marca | null> {
    const buscada = descripcion.trim().toUpperCase();
    const resultados = await this.db
      .select()
      .from(schema.marcas)
      .where(eq(schema.marcas.descripcion, buscada))
      .limit(1);

    return resultados[0] ?? null;
  }
}
