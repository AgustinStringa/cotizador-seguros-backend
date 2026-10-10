import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../database/database.module.js';
import * as schema from '../../database/schema/index.js';
import type { Plan } from '../../database/schema/planes.schema.js';

@Injectable()
export class PlanesService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: DrizzleDatabase,
  ) {}

  async obtenerTodos(): Promise<Plan[]> {
    return this.db
      .select()
      .from(schema.planes)
      .where(eq(schema.planes.activo, true));
  }

  async obtenerPorCodigo(codigo: string): Promise<Plan> {
    const codigoNormalizado = codigo.trim().toLowerCase();
    const resultados = await this.db
      .select()
      .from(schema.planes)
      .where(eq(schema.planes.codigo, codigoNormalizado))
      .limit(1);

    if (resultados[0]) {
      return resultados[0];
    }

    throw new NotFoundException(`Plan con código "${codigo}" no encontrado`);
  }
}
