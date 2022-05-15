import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('tb_category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'category_name',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => ProductEntity, (pro) => pro.category)
  products: ProductEntity[];
}
