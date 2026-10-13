import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, type PaginatedResult } from '@shared/backend';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../../database/database.module.js';
import * as schema from '../../../database/schema/index.js';
import type {
  Cotizacion,
  NuevaCotizacion,
} from '../../../database/schema/cotizaciones.schema.js';

export { type PaginatedResult };

@Injectable()
export class CotizacionesRepository extends BaseRepository<
  Cotizacion,
  NuevaCotizacion,
  DrizzleDatabase
> {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    db: DrizzleDatabase,
  ) {
    super(db, schema.cotizaciones, {
      idColumn: schema.cotizaciones.id,
      orderByColumn: schema.cotizaciones.createdAt,
      orderDirection: 'desc',
      entityName: 'la cotización',
    });
  }
}
