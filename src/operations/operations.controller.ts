import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadExcelDto } from '@/products/dto/create-product.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

    @Post('upload-excel')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: UploadExcelDto,
    ) {
      if (!file) {
        throw new BadRequestException(
          'You need to add te file (.xlsx)',
        );
      }
  
      const branchId = dto.id_branch ? parseInt(dto.id_branch, 10) : 1;
      return this.operationsService.processExcelUpload(file.buffer, branchId);
    }
}
