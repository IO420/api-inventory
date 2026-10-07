import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  //just to test adding id_brach param,but its will change
  @Get('search/:id_branch/:name')
  search(@Param('id_branch') id_branch: string, @Param('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('you cant search nothing');
    }

    return this.inventoryService.searchByName(name.trim(), +id_branch);
  }
}
