import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tb_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome do produto',
  })
  @Column({ name: 'product_name', type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
  })
  @Column({ name: 'product_description', type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Categoria do produto',
  })
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category: CategoryEntity;
}
