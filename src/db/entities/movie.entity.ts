import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'movie' })
export class Movie extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column('text', { nullable: false })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column('text', { nullable: false })
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ManyToOne(() => User, (user) => user.movies)
  sharedBy: User;
}
