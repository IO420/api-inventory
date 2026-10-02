import { Body, Controller, Get, Post } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

      @Post()
      create(@Body() data: CreateUnitDto) {
        return this.unitsService.create(data);
      }
}
