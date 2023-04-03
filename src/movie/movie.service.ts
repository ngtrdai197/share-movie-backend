import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { PaginateDto } from '@/common/dtos/paginate.dto';
import { Movie } from '@/db/entities/movie.entity';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateMovieDao,
  CreateMovieDto,
  CreateMovieResponseDto,
  GetMovieRequestDto,
  GetMoviesResponseDto,
} from './dtos/movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie, SHARE_MOVIE_CONNECTION)
    private readonly movieRepository: Repository<Movie>,
    private readonly userService: UserService,
  ) {}

  public async createShareMovie(
    createMovieDto: CreateMovieDto,
    userId: number,
  ): Promise<CreateMovieResponseDto> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException();
    }
    const dao: CreateMovieDao = {
      ...createMovieDto,
      sharedBy: user,
    };
    const movie = await this.movieRepository.save(
      this.movieRepository.create(dao),
    );

    return plainToInstance(CreateMovieResponseDto, {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      videoUrl: movie.videoUrl,
      sharedBy: movie.sharedBy.email,
      createdDate: movie.createdDate,
      updatedDate: movie.updatedDate,
    });
  }

  public async getListMovies(
    request: GetMovieRequestDto,
  ): Promise<GetMoviesResponseDto> {
    const condition: FindManyOptions<Movie> = {};

    condition.take = request.perPage;
    condition.skip = request.perPage * request.page - request.perPage;

    condition.relations = ['sharedBy'];

    const [movies, total] = await this.movieRepository.findAndCount(condition);

    return plainToInstance(GetMoviesResponseDto, {
      data: movies.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        videoUrl: m.videoUrl,
        sharedBy: m.sharedBy.email,
        createdDate: m.createdDate,
        updatedDate: m.updatedDate,
      })),
      paginate: plainToInstance(PaginateDto, {
        page: request.page,
        size: request.perPage,
        total: total,
      }),
    });
  }
}
