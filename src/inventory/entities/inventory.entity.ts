import { Branch } from '@/branches/entities/branch.entity';
import { Product } from '@/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory')
@Index(['id_branch', 'id_product'], { unique: true })
export class Inventory {
  @PrimaryGeneratedColumn({ name: 'id_inventory' })
  id_inventory: number;

  @Column({ name: 'id_branch', type: 'int' })
  id_branch: number;

  @Column({ name: 'id_product', type: 'int' })
  id_product: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  quantity: number;

  @Column({
    name: 'minimum_stock',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minimum_stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ubication: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Branch, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_branch' })
  branch: Branch;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_product' })
  product: Product;
}