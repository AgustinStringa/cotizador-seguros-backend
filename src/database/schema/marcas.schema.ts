import {
  mysqlTable,
  int,
  varchar,
  boolean,
} from 'drizzle-orm/mysql-core';

export const marcas = mysqlTable('marcas', {
  id: int('id').autoincrement().primaryKey(),
  descripcion: varchar('descripcion', { length: 100 }).notNull().unique(),
  esAltaGama: boolean('es_alta_gama').notNull().default(false),
  activo: boolean('activo').notNull().default(true),
});

export type Marca = typeof marcas.$inferSelect;
export type NuevaMarca = typeof marcas.$inferInsert;
