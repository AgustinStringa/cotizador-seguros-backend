import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CalcularCotizacionDto {
  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  marca: string;

  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(1990, { message: 'El año no puede ser menor a 1990' })
  @Max(new Date().getFullYear() + 1, {
    message: 'El año no puede ser superior al año siguiente',
  })
  anio: number;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de plan es obligatorio' })
  tipoPlan: string;
}
