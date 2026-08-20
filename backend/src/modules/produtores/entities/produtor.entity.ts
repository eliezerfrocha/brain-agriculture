import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Propriedade } from '../../propriedades/entities/propriedade.entity';

@Entity('produtores')
export class Produtor {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '12345678901', description: 'CPF (11) ou CNPJ (14), somente dígitos' })
  @Column({ name: 'cpf_cnpj', unique: true, length: 14 })
  cpfCnpj: string;

  @ApiProperty({ example: 'João da Silva' })
  @Column({ name: 'nome' })
  nome: string;

  @ApiProperty({ type: () => Propriedade, isArray: true })
  @OneToMany(() => Propriedade, (propriedade) => propriedade.produtor, {
    cascade: false,
  })
  propriedades: Propriedade[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
