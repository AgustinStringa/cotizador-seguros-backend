import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';

export const DRIZZLE_DATABASE = 'DRIZZLE_DATABASE';
export type DrizzleDatabase = MySql2Database<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DATABASE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DrizzleDatabase => {
        const pool = mysql.createPool({
          host: configService.get<string>('database.host', 'localhost'),
          port: configService.get<number>('database.port', 3306),
          user: configService.get<string>('database.user', 'root'),
          password: configService.get<string>('database.password', 'root'),
          database: configService.get<string>('database.name', 'cotizador_db'),
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });

        return drizzle(pool, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DRIZZLE_DATABASE],
})
export class DatabaseModule {}
