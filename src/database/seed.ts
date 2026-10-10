import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'cotizador_db',
  });

  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('🌱 Seeding initial planes...');

  await db
    .insert(schema.planes)
    .values([
      {
        codigo: 'basico',
        nombre: 'Plan Básico',
        precioBase: '350.00',
        recargoPorcentaje: '20.00',
        descripcion: 'Cobertura esencial contra terceros y responsabilidad civil',
        activo: true,
      },
      {
        codigo: 'completo',
        nombre: 'Plan Completo',
        precioBase: '700.00',
        recargoPorcentaje: '50.00',
        descripcion: 'Cobertura integral contra todo riesgo, robo, incendio y daños',
        activo: true,
      },
    ])
    .onDuplicateKeyUpdate({
      set: {
        precioBase: sql`VALUES(precio_base)`,
        recargoPorcentaje: sql`VALUES(recargo_porcentaje)`,
        activo: true,
      },
    });

  console.log('🌱 Seeding initial anios...');
  const currentYear = new Date().getFullYear();
  const aniosData = [];
  for (let year = currentYear; year >= 2000; year--) {
    const diferencia = Math.max(0, currentYear - year);
    const porcentaje = Math.max(0, 100 - diferencia * 3);
    const factorDepreciacion = (porcentaje / 100).toFixed(4);
    aniosData.push({
      anio: year,
      factorDepreciacion,
      descripcion: `Vehículos fabricados en el año ${year}`,
      activo: true,
    });
  }

  await db
    .insert(schema.anios)
    .values(aniosData)
    .onDuplicateKeyUpdate({
      set: {
        activo: true,
      },
    });

  console.log('🌱 Seeding initial marcas...');
  const marcasComunes = [
    'VOLKSWAGEN',
    'CHEVROLET',
    'RENAULT',
    'FIAT',
    'FORD',
    'PEUGEOT',
    'TOYOTA',
    'HONDA',
    'NISSAN',
    'CITROEN',
  ];

  const marcasAltaGama = [
    'ALFA ROMEO',
    'JEEP',
    'AUDI',
    'BMW',
    'RAM',
    'FERARI',
    'PORSCHE',
    'MINI COOPER',
    'MERCEDES BENZ',
    'MCLAREN',
    'MASERATI',
  ];

  const marcasData = [
    ...marcasComunes.map((nombre) => ({
      descripcion: nombre,
      esAltaGama: false,
      activo: true,
    })),
    ...marcasAltaGama.map((nombre) => ({
      descripcion: nombre,
      esAltaGama: true,
      activo: true,
    })),
  ];

  await db
    .insert(schema.marcas)
    .values(marcasData)
    .onDuplicateKeyUpdate({
      set: {
        esAltaGama: sql`VALUES(es_alta_gama)`,
        activo: true,
      },
    });

  console.log('✅ Seeding completed!');
  await connection.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
