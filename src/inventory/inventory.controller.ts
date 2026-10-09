import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@/operations/jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  //just to test adding id_brach param,but its will change
  @UseGuards(JwtAuthGuard)
  @Get('search/:id_branch/:name')
  search(@Param('id_branch') id_branch: string, @Param('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('you cant search nothing');
    }

    return this.inventoryService.searchByName(name.trim(), +id_branch);
  }
}
