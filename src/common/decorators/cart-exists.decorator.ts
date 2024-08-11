import { registerDecorator, ValidationOptions } from 'class-validator';
import { CartExistsRule } from '../validators/cart-exists.rule';

export function CartExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CartExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CartExistsRule,
    });
  };
}
