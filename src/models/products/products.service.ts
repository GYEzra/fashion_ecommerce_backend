import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { Product, ProductDocument } from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { CategoriesService } from '../categories/categories.service';
import { ModuleRef } from '@nestjs/core';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';

@Injectable()
export class ProductsService implements OnModuleInit {
  private categoriesService: CategoriesService;

  constructor(
    @InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>,
    private moduleRef: ModuleRef,
  ) {}
  onModuleInit() {
    this.categoriesService = this.moduleRef.get(CategoriesService, { strict: false });
  }

  async create(createProductDto: CreateProductDto, user: IUser): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;

    // Validate category
    const isExistCategory = await this.categoriesService.findOne(categoryId);
    if (!isExistCategory) {
      throw new NotFoundException(CUSTOM_MESSAGES.CATEGORY_ID_NOT_EXIST);
    }

    // Validate product name
    const isExistProduct = await this.productModel.findOne({
      sku: productData.sku,
    });
    if (isExistProduct) {
      throw new BadRequestException(CUSTOM_MESSAGES.PRODUCT_EXIST);
    }

    // Create product
    const newProduct = await this.productModel.create({
      ...productData,
      category: categoryId,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newProduct;
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current || 1;
    const pageSize = +filter.pageSize || 10;
    delete filter.current;
    delete filter.pageSize;

    const offset = (current - 1) * pageSize;
    const limit = pageSize;

    const totalItems = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findOne({ _id: id });
    return product;
  }

  async findMany(ids: string[]) {
    return await this.productModel.find({ _id: { $in: ids } });
  }

  async findByCategoryId(categoryId: string) {
    return await this.productModel.find({ category: categoryId });
  }

  async update(_id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const { categoryId, ...productData } = updateProductDto;

    // Validate category
    const isExistCategory = await this.categoriesService.findOne(categoryId);
    if (!isExistCategory) {
      throw new NotFoundException(CUSTOM_MESSAGES.CATEGORY_ID_NOT_EXIST);
    }

    // Update product
    const updatedProduct = await this.productModel.updateOne(
      { _id },
      {
        ...productData,
        category: categoryId,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updatedProduct;
  }

  async remove(_id: string, user: IUser) {
    const product = await this.productModel.findOne({ _id });
    if (!product) {
      throw new NotFoundException(CUSTOM_MESSAGES.PRODUCT_EXIST);
    }

    await this.productModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.productModel.softDelete({ _id });
  }

  async getProductIfValid(productId: string, color: string, size: string) {
    const product = (await this.productModel.findById(productId)).toObject();

    if (!product.colors.includes(color)) {
      throw new NotFoundException(CUSTOM_MESSAGES.COLOR_NOT_EXIST);
    }

    if (!product.sizes.includes(size)) {
      throw new NotFoundException(CUSTOM_MESSAGES.SIZE_NOT_EXIST);
    }

    return product;
  }
}
