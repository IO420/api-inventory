import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @Post()
  create(@Body() createProductDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductDto);
  }
}
