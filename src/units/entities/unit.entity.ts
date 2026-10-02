import { Product } from '@/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id_unit: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  abbreviation: string;

  @OneToMany(() => Product, (product) => product.unit)
  products: Product[];
}