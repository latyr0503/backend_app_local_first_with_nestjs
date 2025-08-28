import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parcelle } from './parcelles.entity';
import { Campagne } from './campagne.entity';

export enum Statut {
  GENEREE = 'GENEREE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}

@Entity('recommandations')
export class Recommandation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: Statut,
    default: Statut.GENEREE,
  })
  statut: Statut;

  @OneToMany(() => Parcelle, (parcelle) => parcelle.recommandation)
  parcelles: Parcelle[];

  @ManyToOne(() => Campagne, (campagne) => campagne.recommandations)
  campagne: Campagne;
}
