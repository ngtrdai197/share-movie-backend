import { hash } from 'bcryptjs';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ name: 'email', unique: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'hashed_password' })
  @IsString()
  @IsNotEmpty()
  hashedPassword: string;

  @Column({ name: 'salt' })
  @IsString()
  @IsNotEmpty()
  salt: string;

  @OneToMany(() => Movie, (movie) => movie.sharedBy)
  @IsString()
  @IsNotEmpty()
  movies: Movie[];

  public async validatePassword(password: string) {
    if (!this.salt || !this.hashedPassword) {
      throw new Error(
        'Cannot validate password without salt or hashedPassword',
      );
    }
    const hashed = await hash(password, this.salt);
    return this.hashedPassword === hashed;
  }
}
