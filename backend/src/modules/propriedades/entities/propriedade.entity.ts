import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Produtor } from '../../produtores/entities/produtor.entity';
import { CulturaPlantada } from '../../culturas-plantadas/entities/cultura-plantada.entity';

@Entity('propriedades')
export class Propriedade {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Produtor })
  @ManyToOne(() => Produtor, (produtor) => produtor.propriedades, {
    onDelete: 'CASCADE', // decisão: remover produtor remove suas propriedades (ver README)
  })
  @JoinColumn({ name: 'produtor_id' })
  produtor: Produtor;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'produtor_id' })
  produtorId: string;

  @ApiProperty({ example: 'Fazenda Boa Esperança' })
  @Column({ name: 'nome' })
  nome: string;

  @ApiProperty({ example: 'Uberlândia' })
  @Column({ name: 'cidade' })
  cidade: string;

  @ApiProperty({ example: 'MG', description: 'Sigla do estado (UF)' })
  @Column({ name: 'estado', length: 2 })
  estado: string;

  @ApiProperty({ example: 1000 })
  @Column({ name: 'area_total', type: 'numeric', precision: 12, scale: 2 })
  areaTotal: number;

  @ApiProperty({ example: 600 })
  @Column({ name: 'area_agricultavel', type: 'numeric', precision: 12, scale: 2 })
  areaAgricultavel: number;

  @ApiProperty({ example: 300 })
  @Column({ name: 'area_vegetacao', type: 'numeric', precision: 12, scale: 2 })
  areaVegetacao: number;

  @ApiProperty({ type: () => CulturaPlantada, isArray: true })
  @OneToMany(() => CulturaPlantada, (cp) => cp.propriedade)
  culturasPlantadas: CulturaPlantada[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
