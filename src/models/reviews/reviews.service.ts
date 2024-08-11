import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import aqp from 'api-query-params';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: SoftDeleteModel<ReviewDocument>,
    private productService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: IUser) {
    const { productId, ...rest } = createReviewDto;

    const product = await this.productService.findOne(productId);

    if (!product) throw new BadRequestException('Sản phẩm không tồn tại');

    const existReview = await this.reviewModel.exists({
      user: user._id,
      product: productId,
    });

    if (existReview) throw new BadRequestException('Bạn đã đánh giá cho sản phẩm này rồi!');

    return await this.reviewModel.create({
      user: user._id,
      product: productId,
      ...rest,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current || 1;
    const pageSize = +filter.pageSize || 10;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.reviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.reviewModel
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
    return await this.reviewModel.findOne({ _id });
  }

  async update(_id: string, updateReviewDto: UpdateReviewDto, user: IUser) {
    return await this.reviewModel.updateOne(
      { _id },
      {
        ...updateReviewDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(_id: string, user: IUser) {
    await this.reviewModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.reviewModel.softDelete({ _id });
  }

  async getAvgRating(productId: string): Promise<number> {
    const reviews = await this.reviewModel.find({ product: productId }).exec();
    const sum = reviews.reduce((accumulator, review) => accumulator + review.score, 0);
    return sum / reviews.length;
  }
}
