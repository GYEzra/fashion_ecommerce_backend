import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';

export class ApplyPromotionDto extends PartialType(
  PickType(CreatePromotionDto, ['coupon'] as const),
) {}
