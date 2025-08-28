import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Parcelle } from './parcelles.entity';
import { AgentCollecteur } from './agents_collecteurs.entity';

@Entity('collectes')
export class Collecte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  statut: string;

  @Column()
  type: string;

  @OneToMany(() => Parcelle, (parcelle) => parcelle.collecte)
  parcelles: Parcelle[];
  @OneToMany(
    () => AgentCollecteur,
    (agentCollecteur) => agentCollecteur.collectes,
  )
  agentCollecteurs: AgentCollecteur[];
}
