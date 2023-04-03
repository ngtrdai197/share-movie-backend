import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { User } from '@/mariadb/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], SHARE_MOVIE_CONNECTION)],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
