import { Product } from '@/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('product_types')
export class ProductType {
  @PrimaryGeneratedColumn()
  id_product_type: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Product, (product) => product.productType)
  products: Product[];
  
}