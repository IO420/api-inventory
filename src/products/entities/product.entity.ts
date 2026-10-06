// import { Category } from '@/categories/entities/category.entity';
import { ProductType } from '@/product-types/entities/product-type.entity';
import { Unit } from '@/units/entities/unit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
@Unique(['sku'])
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column({ type: 'int', nullable: false })
  id_product_type: number;

  // @Column({ type: 'int' })
  // id_category: number;

  @Column({ name: 'id_unit', type: 'int', nullable: false })
  id_unit: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => ProductType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_product_type' })
  productType: ProductType;

  // @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  // @JoinColumn({ name: 'id_category' })
  // category: Category;

  @ManyToOne(() => Unit, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_unit' })
  unit: Unit;
}
