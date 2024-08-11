import { registerDecorator, ValidationOptions } from 'class-validator';
import { ProductExistsRule } from '../validators/product-exists.rule';

export function ProductExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ProductExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ProductExistsRule,
    });
  };
}
