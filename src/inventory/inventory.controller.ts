import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@/operations/jwt-auth.guard';

export interface AuthenticatedUser {
  userId: string;
  userName: string;
  branch: number;
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search/:name')
  async search(
    @Param('name') name: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('you cant search nothing');
    }
    const id_branch = req.user.branch;

    const data = await this.inventoryService.searchByName(
      name.trim(),
      id_branch,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('countInventory')
  async inventory(@Req() req: { user: AuthenticatedUser }) {
    return this.inventoryService.inventory(req.user.branch);
  }

  @UseGuards(JwtAuthGuard)
  @Get('low-stock')
  async getLowStockCount(@Req() req: { user: AuthenticatedUser }) {
    const count = await this.inventoryService.countLowStockProducts(
      req.user.branch,
    );
    return count;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async product(@Param('id') id: number) {
    return this.inventoryService.product(id);
  }
}
