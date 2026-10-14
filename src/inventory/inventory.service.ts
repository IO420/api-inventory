import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inventory } from './entities/inventory.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import MeiliSearch from 'meilisearch';

@Injectable()
export class InventoryService {
  private meiliClient: MeiliSearch;

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly configService: ConfigService,
  ) {
    this.meiliClient = new MeiliSearch({
      host: this.configService.getOrThrow<string>('MEILISEARCH_HOST'),
      apiKey: this.configService.getOrThrow<string>('MEILISEARCH_KEY'),
    });
  }

  async searchByName(name: string, branchId: number) {
    try {
      const searchResult = await this.meiliClient
        .index('products')
        .search(name, {
          filter: `branches_with_stock = ${branchId}`,
        });

      const hits = searchResult.hits;

      if (!hits || hits.length === 0) {
        return [];
      }

      const productIds = hits.map((hit) => hit.id);

      const inventoryItems = await this.inventoryRepository.find({
        where: {
          id_branch: branchId,
          id_product: In(productIds),
        },
        relations: {
          product: true,
        },
      });

      const inventoryMap = new Map(
        inventoryItems.map((item) => [item.id_product, item]),
      );

      const formattedResults = hits
        .map((hit) => {
          const inv = inventoryMap.get(hit.id);
          if (!inv) return null;

          return {
            id_product: hit.id,
            name: inv.product?.name ?? hit.name,
            brand: inv.product?.brand ?? hit.brand,
            location: inv.ubication ?? '',
            quantity: Number(inv.quantity),
            minimum_stock: Number(inv.minimum_stock),
            id_branch: inv.id_branch,
          };
        })
        .filter(Boolean);
      return formattedResults;
    } catch (error) {
      console.warn('[Meilisearch / Inventory] Error searching:', error.message);
      return [];
    }
  }
}
//IO
