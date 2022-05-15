import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('tb_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'product_description', type: 'text', nullable: true })
  description: string;

  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category: CategoryEntity;
}
