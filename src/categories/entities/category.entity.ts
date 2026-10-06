// import { Product } from '@/products/entities/product.entity';
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// @Entity('categories')
// export class Category {
//   @PrimaryGeneratedColumn()
//   id_category: number;

//   @Column({ type: 'varchar' })
//   name: string;

//   @Column({ type: 'varchar', nullable: true })
//   description: string;

//   @Column({ type: 'boolean', default: true })
//   active: boolean;

//   @OneToMany(() => Product, (product) => product.category)
//   products: Product[];
// }