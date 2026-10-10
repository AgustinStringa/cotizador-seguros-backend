import {
  mysqlTable,
  int,
  varchar,
  decimal,
  boolean,
} from 'drizzle-orm/mysql-core';

export const anios = mysqlTable('anios', {
  id: int('id').autoincrement().primaryKey(),
  anio: int('anio').notNull().unique(),
  factorDepreciacion: decimal('factor_depreciacion', {
    precision: 5,
    scale: 4,
  }).notNull(),
  descripcion: varchar('descripcion', { length: 255 }),
  activo: boolean('activo').notNull().default(true),
});

export type Anio = typeof anios.$inferSelect;
export type NuevoAnio = typeof anios.$inferInsert;
