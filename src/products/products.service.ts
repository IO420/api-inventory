import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import MeiliSearch from 'meilisearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService implements OnModuleInit {
  private meiliClient: MeiliSearch;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    const meiliHost = this.configService.getOrThrow<string>('MEILISEARCH_HOST');
    const meiliKey = this.configService.getOrThrow<string>('MEILISEARCH_KEY');

    this.meiliClient = new MeiliSearch({
      host: meiliHost,
      apiKey: meiliKey,
    });
  }

  async onModuleInit() {
    try {
      const index = this.meiliClient.index('products');
      await index.updateSearchableAttributes([
        'name',
        'brand',
        'description',
        'sku',
      ]);
      await index.updateFilterableAttributes(['branches_with_stock']);

      console.log('[ProductsService] Conexión exitosa con Meilisearch');
    } catch (error) {
      console.warn(
        '[ProductsService] warning: cant connect whit meiliSearch.',
      );
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  findOneBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { sku } });
  }

  findOneById(id_product: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id_product } });
  }

  findOneByNameAndBrand(name: string, brand: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { name, brand } });
  }

  async create(createProductDto: CreateProductDto) {
    if (createProductDto?.sku) {
      const found = await this.findOneBySku(createProductDto.sku);

      if (found) {
        throw new ConflictException(
          `The product sku "${createProductDto.sku}" already exist.`,
        );
      }
    }

    const found2 = await this.findOneByNameAndBrand(
      createProductDto.name,
      createProductDto.brand,
    );

    if (found2) {
      throw new ConflictException(
        `The product with name "${createProductDto.name}" and brand "${createProductDto.brand}" already exists.`,
      );
    }

    const created = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(created);

    try {
      await this.meiliClient.index('products').addDocuments([
        {
          id: savedProduct.id_product,
          name: savedProduct.name,
          brand: savedProduct.brand,
          sku: savedProduct.sku,
          description: savedProduct.description,
          branches_with_stock: [],
        },
      ]);
    } catch (error) {
      console.warn('[Meilisearch] cant create the product.');
    }

    return savedProduct;
  }

  async searchByName(name: string) {
    try {
      const searchResult = await this.meiliClient
        .index('products')
        .search(name, {
          limit: 20,
        });
      return searchResult.hits;
    } catch (error) {
      console.warn(
        '[Meilisearch] Error in search.',
      );
      return [];
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const found = await this.findOneById(id);

    if (!found) {
      throw new ConflictException(`The product id: "${id}" doesnt exist.`);
    }

    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOneById(id);

    if (updatedProduct) {
      try {
        await this.meiliClient.index('products').updateDocuments([
          {
            id: updatedProduct.id_product,
            name: updatedProduct.name,
            brand: updatedProduct.brand,
            sku: updatedProduct.sku,
            description: updatedProduct.description,
          },
        ]);
      } catch (error) {
        console.warn('[Meilisearch] cant update.');
      }
    }

    return updatedProduct;
  }

  async deleteAllProducts() {
    try {
      const index = this.meiliClient.index('products');
      await index.deleteAllDocuments();
      console.log('[Meilisearch] cleand.');
    } catch (error) {
      console.error('[Meilisearch] Error to delete:', error.message);
    }
  }
}
//IO
