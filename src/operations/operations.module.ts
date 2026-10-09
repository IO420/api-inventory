import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/products/entities/product.entity';
import { Inventory } from '@/inventory/entities/inventory.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory])],
  controllers: [OperationsController],
  providers: [OperationsService, JwtStrategy],
})
export class OperationsModule {}
