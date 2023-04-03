import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { User } from '@/mariadb/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { genSaltSync, hash, hashSync } from 'bcryptjs';
import { mock } from 'ts-mockito';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User, SHARE_MOVIE_CONNECTION),
          useValue: mock(Repository),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User, SHARE_MOVIE_CONNECTION),
    );
  });

  const password = 'test_password';
  const salt = genSaltSync();
  const hashedPassword = hashSync(password, salt);
  const email = 'dainguyen.iammm@gmail.com';
  const userId = 1;
  const createUserDto: CreateUserDto = {
    email,
    hashedPassword,
    salt,
  };
  const expectedUser: User = {
    id: userId,
    ...createUserDto,
    createdDate: expect.any(Date),
    updatedDate: expect.any(Date),
    movies: [],
    validatePassword: async function (password: string): Promise<boolean> {
      const hashed = await hash(password, this.salt);
      return this.hashedPassword === hashed;
    },
  };

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should create and return a new user', async () => {
    jest.spyOn(userRepository, 'create').mockReturnValue(expectedUser);
    jest.spyOn(userRepository, 'save').mockImplementation(async () => {
      expectedUser.id = userId;
      expectedUser.createdDate = new Date();
      expectedUser.updatedDate = new Date();
      return expectedUser;
    });
    const user = await userService.create(createUserDto);

    expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(userRepository.save).toHaveBeenCalledWith(expectedUser);
    expect(user.createdDate).toEqual(expectedUser.createdDate);
    expect(user.updatedDate).toEqual(expectedUser.updatedDate);
    expect(user).toEqual(expectedUser);
  });

  it('find one user by email and return user', async () => {
    const conditions: FindOneOptions<User> = {
      where: {
        email,
      },
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(expectedUser);

    const user = await userService.findOne(email);
    expect(userRepository.findOne).toHaveBeenCalledWith(conditions);
    expect(user).toEqual(expectedUser);
  });

  it('find one user by id and return user', async () => {
    const conditions: FindOneOptions<User> = {
      where: {
        id: userId,
      },
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(expectedUser);

    const user = await userService.findById(userId);
    expect(userRepository.findOne).toHaveBeenCalledWith(conditions);
    expect(user).toEqual(expectedUser);
  });

  it('get profile', async () => {
    const conditions: FindOneOptions<User> = {
      where: {
        id: userId,
      },
    };
    const expectedUser: User = {
      id: userId,
      email: email,
      createdDate: expect.any(Date),
      updatedDate: expect.any(Date),
      hashedPassword: undefined,
      salt: undefined,
      movies: undefined,
      validatePassword: async function (password: string): Promise<boolean> {
        const hashed = await hash(password, this.salt);
        return this.hashedPassword === hashed;
      },
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(expectedUser);

    const user = await userService.findById(userId);
    expect(userRepository.findOne).toHaveBeenCalledWith(conditions);
    expect(user).toEqual(expectedUser);
  });
});
