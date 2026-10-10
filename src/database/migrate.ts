import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'cotizador_db',
    multipleStatements: true,
  });

  const db = drizzle(connection);

  console.log('⏳ Running database migrations on cotizador_db...');
  await migrate(db, { migrationsFolder: './src/database/migrations' });
  console.log('✅ Migrations completed successfully!');

  await connection.end();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
