import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import {
  DRIZZLE_DATABASE,
  type DrizzleDatabase,
} from '../../database/database.module.js';
import * as schema from '../../database/schema/index.js';
import type { Anio } from '../../database/schema/anios.schema.js';

@Injectable()
export class AniosService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: DrizzleDatabase,
  ) {}

  async obtenerTodos(): Promise<Anio[]> {
    return this.db
      .select()
      .from(schema.anios)
      .where(eq(schema.anios.activo, true))
      .orderBy(desc(schema.anios.anio));
  }

  async obtenerPorAnio(anio: number): Promise<Anio> {
    const anioNumero = Number(anio);
    if (isNaN(anioNumero)) {
      throw new NotFoundException(`Año "${anio}" no válido`);
    }

    const resultados = await this.db
      .select()
      .from(schema.anios)
      .where(eq(schema.anios.anio, anioNumero))
      .limit(1);

    if (resultados[0]) {
      return resultados[0];
    }

    throw new NotFoundException(`Año "${anio}" no encontrado`);
  }
}
