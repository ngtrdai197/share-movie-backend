import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { jwtConstants } from './constants';
import {
  AuthResponseDto,
  GetProfileResponse,
  LoginRequestDto,
  RegisterUserDto,
} from './dtos/auth.dto';
import { ISignTokenPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async onLogin(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOne(loginDto.email);
    if (!user)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credential is invalid',
      });

    const isValid = await user.validatePassword(loginDto.password);
    if (!isValid)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credential is invalid',
      });
    return this.signToken({ email: user.email, userId: user.id });
  }

  async onRegister(authDto: RegisterUserDto): Promise<AuthResponseDto> {
    const existingUser = await this.userService.findOne(authDto.email);
    if (existingUser)
      throw new ConflictException({
        statusCode: 409,
        message: 'Email already exists',
      });

    const salt = await genSalt();

    const user = await this.userService.create({
      email: authDto.email,
      hashedPassword: await hash(authDto.password, salt),
      salt,
    });

    return this.signToken({ email: user.email, userId: user.id });
  }

  public async getProfile(userId: number): Promise<GetProfileResponse> {
    const user = await this.userService.getProfile(userId);

    return plainToInstance(GetProfileResponse, {
      id: user.id,
      email: user.email,
      createdDate: user.createdDate,
      updatedDate: user.updatedDate,
    });
  }

  public async signToken(payload: ISignTokenPayload): Promise<AuthResponseDto> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: jwtConstants.expiredTime,
        secret: jwtConstants.secret,
      }),
    };
  }
}
