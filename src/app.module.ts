import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { MariadbModule } from './db/mariadb.module';
import { EnvironmentModule } from './environment/environment.module';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MariadbModule.forRoot(),
    EnvironmentModule.forRoot(),
    AuthModule,
    UserModule,
    MovieModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
