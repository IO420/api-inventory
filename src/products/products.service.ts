import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findOneBySku(sku: string): Promise<Product | null> {
    const product = this.productRepository.findOne({ where: { sku } });
    return product;
  }

  findOneById(id_product: number): Promise<Product | null> {
    const product = this.productRepository.findOne({ where: { id_product } });
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const found = await this.findOneBySku(createProductDto.sku);

    if (found) {
      throw new ConflictException(
        `The product sku "${createProductDto.sku}" already exist.`,
      );
    }

    const created = this.productRepository.create(createProductDto);
    return this.productRepository.save(created);
  }

  findAll() {
    return this.productRepository.find();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const found = await this.findOneById(id);

    if (!found) {
      throw new ConflictException(`The product id: "${id}" doesnt exist.`);
    }

    return this.productRepository.update(id, updateProductDto);
  }
}
//IO