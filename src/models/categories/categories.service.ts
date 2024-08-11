import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';
import { ModuleRef } from '@nestjs/core';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoriesService implements OnModuleInit {
  private productsService: ProductsService;

  constructor(
    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.productsService = this.moduleRef.get(ProductsService, { strict: false });
  }

  async create(createCategoryDto: CreateCategoryDto, user: IUser): Promise<Category> {
    const isExist = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (isExist) {
      throw new BadRequestException(CUSTOM_MESSAGES.CATEGORY_EXIST);
    }

    const newCategory = await this.categoryModel.create({
      ...createCategoryDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      throw new NotFoundException(CUSTOM_MESSAGES.CATEGORY_ID_NOT_EXIST);
    }
    return category;
  }

  async update(
    _id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: IUser,
  ): Promise<Category | null> {
    const existingCategory = await this.categoryModel.findOne({ _id });
    if (!existingCategory) {
      throw new NotFoundException(CUSTOM_MESSAGES.CATEGORY_ID_NOT_EXIST);
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      { _id },
      {
        ...updateCategoryDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );

    return updatedCategory;
  }

  async remove(id: string, user: IUser): Promise<{ deleted: number }> {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      throw new NotFoundException(CUSTOM_MESSAGES.CATEGORY_ID_NOT_EXIST);
    }

    const isExistProduct = await this.productsService.findByCategoryId(id);
    if (isExistProduct.length > 0) {
      throw new BadRequestException(CUSTOM_MESSAGES.CATEGORY_HAS_PRODUCT);
    }

    await this.categoryModel.updateOne(
      { id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.categoryModel.softDelete({ _id: id });
  }
}
