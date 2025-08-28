import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('gestionnaires_cooperatives')
export class GestionnaireCooperative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  nomCooperative: string;

  @Column()
  village: string;

  @Column()
  commune: string;

  @Column()
  departement: string;
}
