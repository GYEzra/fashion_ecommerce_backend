import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { CouponStatus, DiscountType } from 'src/common/enums/enums';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: SoftDeleteModel<PromotionDocument>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto, user: IUser) {
    const { coupon, start_date, end_date, discount_type, discount_amount, condition } =
      createPromotionDto;
    const isExist = await this.promotionModel.findOne({ coupon: coupon });
    if (isExist) {
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_EXIST);
    }

    if (start_date >= end_date) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_DATE_RANGE);
    }

    if (discount_type === DiscountType.FIXED_AMOUNT && discount_amount <= 0) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_AMOUNT);
    }

    if (
      discount_type === DiscountType.PERCENTAGE &&
      (discount_amount <= 0 || discount_amount > 100)
    ) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_PERCENTAGE);
    }

    return await this.promotionModel.create({
      ...createPromotionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.promotionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.promotionModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(_id: string) {
    return await this.promotionModel.findById(_id);
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto, user: IUser) {
    const { coupon, start_date, end_date, discount_type, discount_amount, condition } =
      updatePromotionDto;

    const promotion = await this.promotionModel.findOne({ _id: id });
    if (!promotion) {
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_NOT_EXIST);
    }

    if (coupon && coupon !== promotion.coupon) {
      const isNameExist = await this.promotionModel.findOne({
        coupon: coupon,
      });
      if (isNameExist) {
        throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_EXIST);
      }
    }

    if (start_date >= end_date) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_DATE_RANGE);
    }

    if (discount_type === DiscountType.FIXED_AMOUNT && discount_amount <= 0) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_AMOUNT);
    }

    if (
      discount_type === DiscountType.PERCENTAGE &&
      (discount_amount <= 0 || discount_amount > 100)
    ) {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_DISCOUNT_PERCENTAGE);
    }

    return await this.promotionModel.updateOne(
      { _id: id },
      {
        ...updatePromotionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const promotion = await this.promotionModel.findOne({ _id: id });
    if (!promotion) {
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_NOT_EXIST);
    }

    await this.promotionModel.updateOne(
      { id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.promotionModel.softDelete({ id });
  }

  async getValidPromotion(code: string, subTotal: number) {
    const promotion = await this.promotionModel.findOne({ coupon: code });

    if (promotion) {
      return this.isValidPromotion(subTotal, promotion) ? promotion : null;
    } else {
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_NOT_EXIST);
    }
  }

  private isValidPromotion(subTotal: number, promotion: Promotion): boolean {
    const now = new Date();

    if (
      now < promotion.start_date ||
      now > promotion.end_date ||
      !(promotion.status === CouponStatus.ACTIVE)
    ) {
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_EXPIRED);
    }

    if (promotion.condition && subTotal < promotion.condition)
      throw new BadRequestException(CUSTOM_MESSAGES.PROMOTION_CONDITIONS_NOT_MET);

    return true;
  }

  async calculateDiscountAmount(coupon: string | null, subTotal: number): Promise<number> {
    if (!coupon) return 0;

    const promotion = await this.promotionModel.findOne({ coupon: coupon });

    return promotion.discount_type === DiscountType.FIXED_AMOUNT
      ? subTotal - promotion.discount_amount
      : subTotal * (promotion.discount_amount / 100);
  }
}
