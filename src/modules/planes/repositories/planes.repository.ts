import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@shared/backend';
import { eq } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../../database/database.module.js';
import * as schema from '../../../database/schema/index.js';
import type {
  Plan,
  NuevoPlan,
} from '../../../database/schema/planes.schema.js';

@Injectable()
export class PlanesRepository extends BaseRepository<
  Plan,
  NuevoPlan,
  DrizzleDatabase
> {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    db: DrizzleDatabase,
  ) {
    super(db, schema.planes, {
      idColumn: schema.planes.id,
      orderByColumn: schema.planes.id,
      entityName: 'el plan',
    });
  }

  async obtenerActivos(): Promise<Plan[]> {
    return this.db
      .select()
      .from(schema.planes)
      .where(eq(schema.planes.activo, true));
  }

  async obtenerPorCodigo(codigo: string): Promise<Plan | null> {
    const codigoNormalizado = codigo.trim().toLowerCase();
    const resultados = await this.db
      .select()
      .from(schema.planes)
      .where(eq(schema.planes.codigo, codigoNormalizado))
      .limit(1);

    return resultados[0] ?? null;
  }
}
