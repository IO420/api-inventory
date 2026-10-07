import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MeiliSearch from 'meilisearch';

@Injectable()
export class InventoryService {
  private meiliClient: MeiliSearch;

  constructor(private readonly configService: ConfigService) {
    this.meiliClient = new MeiliSearch({
      host: this.configService.getOrThrow<string>('MEILISEARCH_HOST'),
      apiKey: this.configService.getOrThrow<string>('MEILISEARCH_KEY'),
    });
  }

  async searchByName(name: string, branchId: number = 1) {
    try {
      const searchResult = await this.meiliClient
        .index('products')
        .search(name, {
          filter: `branches_with_stock = ${branchId}`,
        });

      return searchResult.hits;
    } catch (error) {
      console.warn(
        '[Meilisearch] Error searching:',
        error.message,
      );
      return [];
    }
  }
}
//IO