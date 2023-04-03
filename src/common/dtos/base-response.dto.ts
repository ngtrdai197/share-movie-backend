import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class BaseResponseDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  updatedDate: Date;
}
