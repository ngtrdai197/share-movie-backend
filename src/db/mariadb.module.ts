import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { EnvironmentService } from '@/environment/environment.service';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { User } from './entities/user.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        TypeOrmModule.forRootAsync({
          name: SHARE_MOVIE_CONNECTION,
          useFactory: async (envService: EnvironmentService) => {
            return {
              type: 'mysql',
              entities: [User, Movie],
              replication: {
                master: envService.master,
                slaves: envService.slaves,
              },
              autoLoadEntities: false,
              synchronize: false,
              logging: !!envService.get<number>('db.is_logging'),
            };
          },
          inject: [EnvironmentService],
        }),
      ],
    };
  }
}
