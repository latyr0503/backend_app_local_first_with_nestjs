import { User } from './user.entity';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Parcelle } from './parcelles.entity';
import { GestionnaireCooperative } from './gestionnaires_cooperatives.entity';

export enum Statut {
  CE = 'CE',
  CM = 'CM',
  FEM = 'FEM',
  SH = 'SH',
  Nawa = 'Nawa',
  Nawa_CE = 'Nawa_CE',
  Nawa_CM = 'Nawa_CM',
}

@Entity('producteurs')
export class Producteur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  numeroCNI: string;

  @Column()
  langueParlee: string;

  @Column()
  dateNaissance: Date;

  @Column({
    type: 'enum',
    enum: Statut,
    default: Statut.CE,
  })
  statut: Statut;

  @OneToMany(() => Parcelle, (parcelle) => parcelle.producteur)
  parcelles: Parcelle[];

  @OneToMany(() => GestionnaireCooperative, (cooperative) => cooperative.user)
  cooperatives: GestionnaireCooperative[];
}
