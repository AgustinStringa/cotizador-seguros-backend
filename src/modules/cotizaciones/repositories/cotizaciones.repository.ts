import { Inject, Injectable } from '@nestjs/common';
import { count, desc, eq } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../../database/database.module.js';
import * as schema from '../../../database/schema/index.js';
import type {
  Cotizacion,
  NuevaCotizacion,
} from '../../../database/schema/cotizaciones.schema.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CotizacionesRepository {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: DrizzleDatabase,
  ) {}

  async create(data: NuevaCotizacion): Promise<Cotizacion> {
    const [result] = await this.db.insert(schema.cotizaciones).values(data);
    const created = await this.findById(Number(result.insertId));
    if (!created) {
      throw new Error('Error al recuperar la cotización recién creada');
    }
    return created;
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<Cotizacion>> {
    const offset = (page - 1) * limit;

    const [totalRecord] = await this.db
      .select({ total: count() })
      .from(schema.cotizaciones);

    const total = Number(totalRecord?.total ?? 0);

    const items = await this.db
      .select()
      .from(schema.cotizaciones)
      .orderBy(desc(schema.cotizaciones.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: number): Promise<Cotizacion | null> {
    const results = await this.db
      .select()
      .from(schema.cotizaciones)
      .where(eq(schema.cotizaciones.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db
      .delete(schema.cotizaciones)
      .where(eq(schema.cotizaciones.id, id));

    return result.affectedRows > 0;
  }
}
