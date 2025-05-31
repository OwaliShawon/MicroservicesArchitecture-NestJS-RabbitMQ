import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example: {
        summary: 'Create Product Example',
        value: {
          name: 'Sample Product',
          description: 'A sample product for demonstration.',
          price: 99.99,
          stock: 10,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const decodedToken = req.user;
    return this.productsService.create(createProductDto, decodedToken.userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all products.',
    schema: {
      example: [
        {
          _id: '665a1b2c3d4e5f6a7b8c9d0e',
          name: 'Sample Product',
          description: 'A sample product for demonstration.',
          price: 99.99,
          stock: 10,
        },
      ],
    },
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a product by ID.',
    schema: {
      example: {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Sample Product',
        description: 'A sample product for demonstration.',
        price: 99.99,
        stock: 10,
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      example: {
        summary: 'Update Product Example',
        value: {
          name: 'Updated Product Name',
          price: 79.99,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const decodedToken = req.user;
    return this.productsService.update(
      id,
      updateProductDto,
      decodedToken.userId,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const decodedToken = req.user;
    return this.productsService.remove(id, decodedToken.userId);
  }
}
