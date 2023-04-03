import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { Movie } from '@/db/entities/movie.entity';
import { UserService } from '@/user/user.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMovieDto,
  CreateMovieResponseDto,
  GetMovieRequestDto,
} from './dtos/movie.dto';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let userService: UserService;
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie, SHARE_MOVIE_CONNECTION),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(
      getRepositoryToken(Movie, SHARE_MOVIE_CONNECTION),
    );
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
    expect(movieRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should throw BadRequestException if user not found', async () => {
    const createMovieDto: CreateMovieDto = {
      title: 'The Matrix',
      description: 'A great action movie',
      videoUrl: 'https://www.youtube.com/watch?v=m8e-FF8MsqU',
    };
    const userId = 1;

    (userService.findById as jest.Mock).mockResolvedValueOnce(undefined); // mock user not found

    await expect(
      movieService.createShareMovie(createMovieDto, userId),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return CreateMovieResponseDto if user exists and movie created successfully', async () => {
    const createMovieDto: CreateMovieDto = {
      title: 'The Matrix',
      description: 'A great action movie',
      videoUrl: 'https://www.youtube.com/watch?v=m8e-FF8MsqU',
    };
    const userId = 1;
    const user = { id: 1, email: 'dainguyen.iammm@gmail.com' };

    (userService.findById as jest.Mock).mockResolvedValueOnce(user); // mock user found
    (movieRepository.create as jest.Mock).mockReturnValue(createMovieDto); // mock DAO object
    (movieRepository.save as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...createMovieDto,
      sharedBy: user,
      createdDate: new Date(),
      updatedDate: new Date(),
    }); // mock saved movie

    const result = await movieService.createShareMovie(createMovieDto, userId);

    expect(result).toBeInstanceOf(CreateMovieResponseDto);
    expect(result.title).toEqual(createMovieDto.title);
    expect(result.description).toEqual(createMovieDto.description);
    expect(result.videoUrl).toEqual(createMovieDto.videoUrl);
    expect(result.sharedBy).toEqual(user.email);
  });

  describe('getListMovies', () => {
    it('should return empty array if no movies found', async () => {
      const request: GetMovieRequestDto = { page: 1, perPage: 10 };

      (movieRepository.findAndCount as jest.Mock).mockResolvedValueOnce([
        [],
        0,
      ]); // mock empty array

      const result = await movieService.getListMovies(request);

      expect(result.data.length).toEqual(0);
      expect(result.paginate.page).toEqual(request.page);
      expect(result.paginate.size).toEqual(request.perPage);
      expect(result.paginate.total).toEqual(0);
    });

    it('should return movies if found', async () => {
      const request: GetMovieRequestDto = { page: 1, perPage: 10 };
      const movies = [
        {
          id: 1,
          title: 'The Matrix',
          description: 'A great action movie',
          videoUrl: 'https://www.youtube.com/watch?v=m8e-FF8MsqU',
          createdDate: new Date(),
          updatedDate: new Date(),
          sharedBy: { id: 1, email: 'dainguyen.iammm@example.com' },
        },
        {
          id: 2,
          title: 'Jurassic Park',
          description: 'A classic adventure movie',
          videoUrl: 'https://www.youtube.com/watch?v=lc0UehYemQA',
          createdDate: new Date(),
          updatedDate: new Date(),
          sharedBy: { id: 2, email: 'nguyendai.iamm@example.com' },
        },
      ];

      (movieRepository.findAndCount as jest.Mock).mockResolvedValueOnce([
        movies,
        movies.length,
      ]); // mock movies found

      const result = await movieService.getListMovies(request);

      expect(result.data.length).toEqual(movies.length);
      expect(result.paginate.page).toEqual(request.page);
      expect(result.paginate.size).toEqual(request.perPage);
      expect(result.paginate.total).toEqual(movies.length);
      expect(result.data[0].title).toEqual(movies[0].title);
      expect(result.data[1].title).toEqual(movies[1].title);
      expect(result.data[0].sharedBy).toEqual(movies[0].sharedBy.email);
      expect(result.data[1].sharedBy).toEqual(movies[1].sharedBy.email);
    });
  });
});
