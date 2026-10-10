import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { CotizacionesModule } from './modules/cotizaciones/cotizaciones.module.js';
import { MarcasModule } from './modules/marcas/marcas.module.js';
import { PlanesModule } from './modules/planes/planes.module.js';
import { AniosModule } from './modules/anios/anios.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    CotizacionesModule,
    MarcasModule,
    PlanesModule,
    AniosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
