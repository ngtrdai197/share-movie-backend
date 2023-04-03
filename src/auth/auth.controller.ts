import { FromRequest } from '@/common/decorators/header.decorator';
import { Public } from '@/common/decorators/is-public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterUserDto } from './dtos/auth.dto';
import { ISignTokenPayload } from './interfaces/payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  public async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.onRegister(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  public async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.onLogin(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@FromRequest('user') authPayload: ISignTokenPayload) {
    return this.authService.getProfile(authPayload.userId);
  }
}
