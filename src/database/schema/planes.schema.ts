import {
  mysqlTable,
  int,
  varchar,
  decimal,
  boolean,
} from 'drizzle-orm/mysql-core';

export const planes = mysqlTable('planes', {
  id: int('id').autoincrement().primaryKey(),
  codigo: varchar('codigo', { length: 50 }).notNull().unique(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  precioBase: decimal('precio_base', {
    precision: 10,
    scale: 2,
  }).notNull().default('350.00'),
  recargoPorcentaje: decimal('recargo_porcentaje', {
    precision: 5,
    scale: 2,
  }).notNull(),
  descripcion: varchar('descripcion', { length: 255 }),
  activo: boolean('activo').notNull().default(true),
});

export type Plan = typeof planes.$inferSelect;
export type NuevoPlan = typeof planes.$inferInsert;
