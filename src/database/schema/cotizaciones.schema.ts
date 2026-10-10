import {
  mysqlTable,
  int,
  varchar,
  decimal,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const cotizaciones = mysqlTable('cotizaciones', {
  id: int('id').autoincrement().primaryKey(),
  marca: varchar('marca', { length: 100 }).notNull(),
  anio: int('anio').notNull(),
  tipoPlan: varchar('tipo_plan', { length: 50 }).notNull(),
  precioBase: decimal('precio_base', { precision: 10, scale: 2 })
    .notNull()
    .default('2000.00'),
  factorMarca: decimal('factor_marca', { precision: 6, scale: 4 }).notNull(),
  factorAnio: decimal('factor_anio', { precision: 6, scale: 4 }).notNull(),
  factorPlan: decimal('factor_plan', { precision: 6, scale: 4 }).notNull(),
  precioFinal: decimal('precio_final', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Cotizacion = typeof cotizaciones.$inferSelect;
export type NuevaCotizacion = typeof cotizaciones.$inferInsert;
