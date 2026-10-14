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

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search/:name')
  async search(@Param('name') name: string, @Req() req: any) {
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
}
