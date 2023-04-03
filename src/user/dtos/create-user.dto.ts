import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  hashedPassword: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  salt: string;
}
