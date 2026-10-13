import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@shared/backend';
import { eq, desc } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../../database/database.module.js';
import * as schema from '../../../database/schema/index.js';
import type {
  Anio,
  NuevoAnio,
} from '../../../database/schema/anios.schema.js';

@Injectable()
export class AniosRepository extends BaseRepository<
  Anio,
  NuevoAnio,
  DrizzleDatabase
> {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    db: DrizzleDatabase,
  ) {
    super(db, schema.anios, {
      idColumn: schema.anios.id,
      orderByColumn: schema.anios.anio,
      orderDirection: 'desc',
      entityName: 'el año',
    });
  }

  async obtenerActivosOrdenados(): Promise<Anio[]> {
    return this.db
      .select()
      .from(schema.anios)
      .where(eq(schema.anios.activo, true))
      .orderBy(desc(schema.anios.anio));
  }

  async obtenerPorAnio(anio: number): Promise<Anio | null> {
    const resultados = await this.db
      .select()
      .from(schema.anios)
      .where(eq(schema.anios.anio, anio))
      .limit(1);

    return resultados[0] ?? null;
  }
}
