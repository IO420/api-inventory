import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product-type.dto';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  findAll() {
    return this.productTypeRepository.find();
  }

  findOneByName(name: string) {
    return this.productTypeRepository.findOne({ where: { name } });
  }

  async create(productType: CreateProductTypeDto) {
    const found = await this.findOneByName(productType.name);

    if (found) {
      throw new ConflictException(
        `The product type name: "${productType.name}" already exist.`,
      );
    }

    const created = this.productTypeRepository.create(productType);
    return this.productTypeRepository.save(created);
  }
}
//IO