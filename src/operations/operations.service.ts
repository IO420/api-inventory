import { Product } from '@/products/entities/product.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { MeiliSearch } from 'meilisearch';
import * as XLSX from 'xlsx';
import { Inventory } from '@/inventory/entities/inventory.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OperationsService {
  private meiliClient: MeiliSearch;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.meiliClient = new MeiliSearch({
      host: this.configService.getOrThrow<string>('MEILISEARCH_HOST'),
      apiKey: this.configService.getOrThrow<string>('MEILISEARCH_KEY'),
    });
  }

  async processExcelUpload(fileBuffer: Buffer, branchId: number = 1) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) {
      return {
        message: 'El archivo Excel no contiene datos válidos',
      };
    }

    const dataRows = rows.slice(1);

    const meiliUpdatesMap = new Map<
      number,
      { id: number; name: string; brand: string; quantity: number }
    >();
    let processedCount = 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const row of dataRows) {
        const location = row[0] ? String(row[0]).trim() : '';
        const productName = row[1] ? String(row[1]).trim() : '';
        const hasStockRaw = row[2] ? String(row[2]).trim().toUpperCase() : 'NO';
        const brandName = row[3] ? String(row[3]).trim() : '';

        if (!productName) continue;

        const quantity = hasStockRaw === 'SI' ? 10 : 0;

        let product = await queryRunner.manager.findOne(Product, {
          where: {
            name: productName,
            brand: brandName ? brandName : IsNull(),
          },
        });

        if (!product) {
          product = queryRunner.manager.create(Product, {
            name: productName,
            brand: brandName || null,
            active: true,
            id_product_type: 1,
            id_unit: 1,
          });
          product = await queryRunner.manager.save(product);
        }

        let invItem = await queryRunner.manager.findOne(Inventory, {
          where: {
            id_branch: branchId,
            id_product: product.id_product,
          },
        });

        if (invItem) {
          invItem.quantity = quantity;
          invItem.ubication = location;
          invItem.updated_at = new Date();
        } else {
          invItem = queryRunner.manager.create(Inventory, {
            id_branch: branchId,
            id_product: product.id_product,
            quantity: quantity,
            ubication: location,
            minimum_stock: 0,
            updated_at: new Date(),
          });
        }
        await queryRunner.manager.save(invItem);

        meiliUpdatesMap.set(product.id_product, {
          id: product.id_product,
          name: product.name,
          brand: product.brand || '',
          quantity,
        });

        processedCount++;
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error to process excel: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }

    interface MeiliProductDocument {
      id: number;
      name: string;
      brand: string;
      branches_with_stock: number[];
    }

    if (meiliUpdatesMap.size > 0) {
      try {
        const index = this.meiliClient.index('products');

        const meiliDocumentsToPush: MeiliProductDocument[] = [];

        for (const [productId, item] of meiliUpdatesMap.entries()) {
          let currentBranches: number[] = [];

          try {
            const existingDoc =
              await index.getDocument<MeiliProductDocument>(productId);
            currentBranches = existingDoc.branches_with_stock || [];
          } catch (e) {
            currentBranches = [];
          }

          if (item.quantity > 0) {
            if (!currentBranches.includes(branchId)) {
              currentBranches.push(branchId);
            }
          } else {
            currentBranches = currentBranches.filter((b) => b !== branchId);
          }

          meiliDocumentsToPush.push({
            id: item.id,
            name: item.name,
            brand: item.brand,
            branches_with_stock: currentBranches,
          });
        }

        await index.updateDocuments(meiliDocumentsToPush, { primaryKey: 'id' });
      } catch (meiliError) {
        console.error(
          'Error whit Meilisearch:',
          meiliError.message,
        );
      }
    }

    return {
      message: 'success',
      totalProcessed: processedCount,
      branchIdAssigned: branchId,
    };
  }
}
//IO
