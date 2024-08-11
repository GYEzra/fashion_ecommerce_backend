import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CUSTOM_MESSAGES } from '../enums/custom-messages.enum';
import { ProductsService } from 'src/models/products/products.service';

@ValidatorConstraint({ name: 'CartExists', async: true })
@Injectable()
export class ProductExistsRule implements ValidatorConstraintInterface {
  constructor(private productsService: ProductsService) {}

  async validate(id: string) {
    try {
      return (await this.productsService.findOne(id)) ? true : false;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `ID ${args.value} sản phẩm không tồn tại`;
  }
}
