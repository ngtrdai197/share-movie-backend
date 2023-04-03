import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { PaginateDto } from '@/common/dtos/paginate.dto';
import { User } from '@/db/entities/user.entity';
import { Optional } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class BaseMovieResponse extends BaseResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  sharedBy: string;
}

export class CreateMovieDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  videoUrl: string;
}

export class CreateMovieResponseDto extends BaseMovieResponse {}

export class GetMovieRequestDto {
  @Expose()
  @Type(() => Number)
  @Min(1, { message: 'Min page must be 1' })
  @Optional()
  page = 1;

  @Expose()
  @Type(() => Number)
  @Min(1, { message: 'Min per page must be greater than or equal 1' })
  @Max(10, { message: 'Max per page must be less than or equal 10' })
  @Optional()
  perPage = 10;
}

export class MovieItemDto extends BaseMovieResponse {}

export class GetMoviesResponseDto extends BaseMovieResponse {
  @Expose()
  data: MovieItemDto[];

  @Expose()
  paginate: PaginateDto;
}

export class CreateMovieDao extends CreateMovieDto {
  sharedBy: User;
}
