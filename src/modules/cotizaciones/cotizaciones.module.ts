import { Module } from '@nestjs/common';
import { CotizacionesController } from './controllers/cotizaciones.controller.js';
import { CotizacionesService } from './services/cotizaciones.service.js';
import { CotizacionesRepository } from './repositories/cotizaciones.repository.js';
import { PlanesModule } from '../planes/planes.module.js';
import { MarcasModule } from '../marcas/marcas.module.js';

@Module({
  imports: [PlanesModule, MarcasModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService, CotizacionesRepository],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
