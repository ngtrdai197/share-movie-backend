import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginateDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  total: number;
}
