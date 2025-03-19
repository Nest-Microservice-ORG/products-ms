import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('Product Service');

  onModuleInit() {
    this.$connect(); //crear conexion a db
    this.logger.log(`Database Connected!...`)
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page, limit } = paginationDto;

    if (page === undefined || limit === undefined) {
      throw new Error('Pagination parameters are missing.');
    }
    const totalPages = await this.product.count({where: {available: true}}); //solo mostrar productos disponibles
    const lastPage = Math.ceil( totalPages / limit ); //calcular ultima pagina

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true, //solo mostrar productos disponibles
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }
  }


  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true }
    })
    if(!product) {
      throw new NotFoundException(`Product with id: ${id} not found`)
    }
    return product;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;// desectructuro para no enviar id a la data cuando actualice el producto
    await this.findOne( id );

    return this.product.update({
      where: { id },
      data: data
    })
  }

  //soft Delete
  async remove(id: number) {
    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;
  }

  //Hard Delete
  // async remove(id: number) {
  //   await this.findOne( id );
  //   return this.product.delete({
  //     where: { id }
  //   });
  // }


}
