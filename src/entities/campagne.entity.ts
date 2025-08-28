import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Parcelle } from './parcelles.entity';
import { Recommandation } from './recommandation.entity';

export enum Statut {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('campagnes')
export class Campagne {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  dateDebut: Date;

  @Column()
  dateFin: Date;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Statut,
    default: Statut.INACTIVE,
  })
  statut: Statut;

  @OneToMany(() => Parcelle, (parcelle) => parcelle.campagne)
  parcelles: Parcelle[];

  @OneToMany(() => Recommandation, (recommandation) => recommandation.campagne)
  recommandations: Recommandation[];
}
