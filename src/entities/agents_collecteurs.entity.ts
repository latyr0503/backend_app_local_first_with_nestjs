import { Collecte } from './collecte.entity';
import { User } from './user.entity';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Superviseur } from './superviseur.entity';

@Entity('agents_collecteurs')
export class AgentCollecteur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  zoneAffectation: string;

  @OneToMany(() => Collecte, (collecte) => collecte.agentCollecteurs)
  collectes: Collecte[];

  @ManyToOne(() => Superviseur, (superviseur) => superviseur.agentsCollecteurs)
  superviseur: Superviseur;
}
