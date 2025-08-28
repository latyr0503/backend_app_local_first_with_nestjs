import { User } from './user.entity';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { AgentCollecteur } from './agents_collecteurs.entity';

@Entity('superviseurs')
export class Superviseur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  departement: string;

  @Column({ nullable: true })
  zoneSurveillee?: string;

  @OneToMany(
    () => AgentCollecteur,
    (agentCollecteur) => agentCollecteur.superviseur,
  )
  agentsCollecteurs: AgentCollecteur[];
}
