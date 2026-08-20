import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Propriedade } from '../../propriedades/entities/propriedade.entity';
import { Safra } from '../../safras/entities/safra.entity';
import { Cultura } from '../../culturas/entities/cultura.entity';

/**
 * Requisito de negócio #6: uma propriedade pode ter 0, 1 ou mais culturas
 * plantadas por safra. Esta é a tabela que materializa esse N:N
 * (Propriedade <-> Cultura, através de Safra).
 */
@Entity('culturas_plantadas')
@Unique(['propriedadeId', 'safraId', 'culturaId']) // evita duplicar o mesmo plantio
export class CulturaPlantada {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Propriedade })
  @ManyToOne(() => Propriedade, (p) => p.culturasPlantadas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propriedade_id' })
  propriedade: Propriedade;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'propriedade_id' })
  propriedadeId: string;

  @ApiProperty({ type: () => Safra })
  @ManyToOne(() => Safra, { eager: true })
  @JoinColumn({ name: 'safra_id' })
  safra: Safra;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'safra_id' })
  safraId: string;

  @ApiProperty({ type: () => Cultura })
  @ManyToOne(() => Cultura, { eager: true })
  @JoinColumn({ name: 'cultura_id' })
  cultura: Cultura;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'cultura_id' })
  culturaId: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
