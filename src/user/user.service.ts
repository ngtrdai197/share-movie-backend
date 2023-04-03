import { SHARE_MOVIE_CONNECTION } from '@/common/constants';
import { User } from '@/db/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, SHARE_MOVIE_CONNECTION)
    private usersRepository: Repository<User>,
  ) {}

  public create(user: CreateUserDto) {
    return this.usersRepository.save(this.usersRepository.create(user));
  }

  public findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public findById(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  public async getProfile(userId: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id: userId,
      },
      select: ['id', 'email', 'createdDate', 'updatedDate'],
    });
  }
}
