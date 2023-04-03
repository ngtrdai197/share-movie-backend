import { User } from '@/mariadb/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('onLogin', () => {
    it('should return an access token if credentials are valid', async () => {
      const email = 'john.doe@example.com';
      const password = 'secret';
      const user: User = {
        id: 1,
        email: 'user@example.com',
        hashedPassword: 'hashed_password',
        salt: 'salt',
        movies: [],
        createdDate: new Date(),
        updatedDate: new Date(),
        validatePassword: jest.fn().mockResolvedValue(true),
      };
      const payload = { email: user.email, userId: user.id };
      const accessToken = 'access_token';

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(authService, 'signToken')
        .mockResolvedValueOnce({ accessToken });

      const result = await authService.onLogin({ email, password });

      expect(userService.findOne).toHaveBeenCalledWith(email);
      expect(authService.signToken).toHaveBeenCalledWith(payload);
      expect(result.accessToken).toEqual(accessToken);
    });

    it('should throw an Unauthorized exception if credentials are invalid', async () => {
      const email = 'john.doe@example.com';
      const password = 'secret';
      const user: User = {
        id: 1,
        email: 'user@example.com',
        hashedPassword: 'hashed_password',
        salt: 'salt',
        movies: [],
        createdDate: new Date(),
        updatedDate: new Date(),
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      try {
        await authService.onLogin({ email, password });
      } catch (error: any) {
        expect(userService.findOne).toHaveBeenCalledWith(email);
        expect(error.response.message).toEqual('Credential is invalid');
        expect(error.response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });

    it('should throw an Unauthorized exception if user not found', async () => {
      const email = 'john.doe@example.com';
      const password = 'secret';

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      try {
        await authService.onLogin({ email, password });
      } catch (error: any) {
        expect(userService.findOne).toHaveBeenCalledWith(email);
        expect(error.response.message).toEqual('Credential is invalid');
        expect(error.response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
