import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CartsService } from 'src/models/carts/carts.service';
import { CUSTOM_MESSAGES } from '../enums/custom-messages.enum';

@ValidatorConstraint({ name: 'CartExists', async: true })
@Injectable()
export class CartExistsRule implements ValidatorConstraintInterface {
  constructor(private cartsService: CartsService) {}

  async validate(id: string) {
    try {
      return (await this.cartsService.findOne(id)) ? true : false;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return CUSTOM_MESSAGES.CART_ID_NOT_EXIST;
  }
}
