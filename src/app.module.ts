import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { AccessLogInterceptor } from './common/interceptors/access-log.interceptor';
import { DatabaseModule } from './db/mariadb.module';
import { EnvironmentModule } from './environment/environment.module';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: AccessLogInterceptor,
    },
  ],
})
export class AppModule {}
