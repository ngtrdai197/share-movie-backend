import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseAuthDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterUserDto extends BaseAuthDto {}

export class LoginRequestDto extends BaseAuthDto {}

export class AuthResponseDto {
  @Expose()
  @IsString()
  accessToken: string;
}

export class GetProfileResponse extends BaseResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
