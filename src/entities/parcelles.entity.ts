import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producteur } from './producteurs.entity';
import { Campagne } from './campagne.entity';
import { Recommandation } from './recommandation.entity';
import { Collecte } from './collecte.entity';

@Entity('parcelles')
export class Parcelle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  localisation: string;

  @Column()
  surface_totale: number;

  @Column()
  surface_piquetee: number;

  @Column()
  surface_non_cultivee: number;

  @Column()
  statut: string;

  @Column()
  type: string;

  @ManyToOne(() => Producteur, (producteur) => producteur.parcelles)
  producteur: Producteur;

  @ManyToOne(() => Campagne, (campagne) => campagne.parcelles)
  campagne: Campagne;

  @ManyToOne(() => Recommandation, (recommandation) => recommandation.parcelles)
  recommandation: Recommandation;

  @ManyToOne(() => Collecte, (collecte) => collecte.parcelles)
  collecte: Collecte;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
