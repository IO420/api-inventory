import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { JwtAuthGuard } from '@/operations/jwt-auth.guard';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductDto);
  }
}
