import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UploadExcelDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search/:name')
  search(@Param('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('you cant search nothing');
    }

    return this.productsService.searchByName(name.trim());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // @Delete('meiliSearch')
  // deleteProuctMeiliSearch(){
  //   return this.productsService.deleteAllProducts()
  // }
}
