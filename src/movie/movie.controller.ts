import { ISignTokenPayload } from '@/auth/interfaces/payload.interface';
import { FromRequest } from '@/common/decorators/header.decorator';
import { Public } from '@/common/decorators/is-public.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateMovieDto, GetMovieRequestDto } from './dtos/movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  public shareMovie(
    @Body() shareMovieDto: CreateMovieDto,
    @FromRequest('user') user: ISignTokenPayload,
  ) {
    return this.movieService.createShareMovie(shareMovieDto, user.userId);
  }

  @Get()
  @Public()
  public getListMovies(@Query() request: GetMovieRequestDto) {
    return this.movieService.getListMovies(
      plainToInstance(GetMovieRequestDto, request, {
        exposeDefaultValues: true,
      }),
    );
  }
}
