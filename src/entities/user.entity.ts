import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

export enum UserRole {
  PRODUCTEUR = 'PRODUCTEUR',
  AGENT = 'AGENT',
  GESTIONNAIRE = 'GESTIONNAIRE',
  SUPERVISEUR = 'SUPERVISEUR',
}

export enum Sexe {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  adresse: string;

  @Column({
    type: 'enum',
    enum: Sexe,
  })
  sexe: Sexe;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // ***************************************************************************
  // cette partie n'en fait pas partie

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // ***************************************************************************
}
