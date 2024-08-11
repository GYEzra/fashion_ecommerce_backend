import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import { CUSTOM_MESSAGES } from '../enums/custom-messages.enum';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!mongoose.Types.ObjectId.isValid(value))
      throw new BadRequestException(CUSTOM_MESSAGES.ERROR_MONGO_ID);
    return value;
  }
}
