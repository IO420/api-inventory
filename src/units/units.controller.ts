import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { JwtAuthGuard } from '@/operations/jwt-auth.guard';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: CreateUnitDto) {
    return this.unitsService.create(data);
  }
}
