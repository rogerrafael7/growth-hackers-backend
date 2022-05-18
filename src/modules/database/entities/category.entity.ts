import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tb_category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome da categoria',
  })
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
