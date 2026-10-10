export class CotizacionCalculadaDto {
  marca: string;
  anio: number;
  tipoPlan: string;
  precioBase: number;
  factorMarca: number;
  factorAnio: number;
  factorPlan: number;
  precioFinal: number;
}

export class CotizacionEntityDto extends CotizacionCalculadaDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
