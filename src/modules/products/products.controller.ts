import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from '../categories/categories.service';

@Controller('products')
export class ProductsController {
  constructor(
    readonly productsService: ProductsService,
    readonly categoriesService: CategoriesService,
  ) {}

  @Get(':idCategory/export')
  async exportByCategory(
    @Res() res: Response,
    @Param('idCategory') idCategory: number,
  ) {
    const stream = await this.productsService.exportByCategory(idCategory);
    res.header('Content-Type', 'application/json');
    res.header('Content-Disposition', 'attachment; filename="products.json');
    stream.pipe(res);
  }

  @Post(':idCategory/import')
  @UseInterceptors(FileInterceptor('file'))
  async importProductsByCategory(
    @Param('idCategory')
    idCategory: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!/json/i.test(file.mimetype)) {
      throw new HttpException(
        'Arquivo não suportado. Só é permitido arquivos no formato json',
        HttpStatus.BAD_REQUEST,
      );
    }

    const category = await this.categoriesService.findOne(idCategory);
    if (!category) {
      throw new HttpException('Categoria não existe', HttpStatus.NOT_FOUND);
    }

    const products = JSON.parse(file.buffer.toString());
    return Promise.all(
      products.map((product) =>
        this.productsService.create(
          ProductDto.create({
            ...product,
            idCategory,
          }),
        ),
      ),
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
