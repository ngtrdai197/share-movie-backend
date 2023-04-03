import {
  ConflictException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterUserDto,
} from './dtos/auth.dto';

const authServiceMock = {
  onRegister: jest.fn(),
  onLogin: jest.fn(),
  getProfile: jest.fn(),
};

const authController = new AuthController(authServiceMock as any);

describe('AuthController', () => {
  describe('register', () => {
    it('should throw an error if email has already been taken', async () => {
      const registerDto: RegisterUserDto = {
        email: 'nguyendai.iammm@gmail.com',
        password: 'test_password',
      };
      (authServiceMock.onRegister as jest.Mock).mockRejectedValueOnce(
        new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exists',
        }),
      );

      await expect(authController.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should call authService.onRegister with correct input', async () => {
      const registerDto: RegisterUserDto = {
        email: 'nguyendai.iammm@gmail.com',
        password: 'test_password',
      };
      const expectedResponse: AuthResponseDto = {
        accessToken: 'access_token',
      };
      authServiceMock.onRegister.mockResolvedValueOnce(expectedResponse);

      const result = await authController.register(registerDto);

      expect(authServiceMock.onRegister).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call authService.onLogin with correct input', async () => {
      const loginDto: LoginRequestDto = {
        email: 'nguyendai.iammm@gmail.com',
        password: 'test_password',
      };
      const expectedResponse: AuthResponseDto = {
        accessToken: 'access_token',
      };
      authServiceMock.onLogin.mockResolvedValueOnce(expectedResponse);

      const result = await authController.login(loginDto);

      expect(authServiceMock.onLogin).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(expectedResponse);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginRequestDto = {
        email: 'invalid_email@gmail.com',
        password: 'test_password',
      };
      authServiceMock.onLogin.mockRejectedValueOnce(
        new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Credential is invalid',
        }),
      );

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
