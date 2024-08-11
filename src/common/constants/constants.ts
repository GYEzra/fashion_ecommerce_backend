import { PaymentStatus } from '../enums/enums';
import { OrderStatus } from '../enums/status.enum';

export const API_PARAM_QUERY = {
  name: 'qs',
  required: false,
  type: String,
  example: 'current=1&pageSize=2&populate=role&fields=-fullname&fullname=Khánh&sort=createdAt',
  description:
    'Build query string để thực hiện phân trang, tìm kiếm, sắp xếp, lấy thêm dữ liệu từ Related documents',
};

export const TAX_RATE = 10 / 100;

export const OrderStatusTransitions = {
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],
  [OrderStatus.Confirmed]: [OrderStatus.Shipping, OrderStatus.Cancelled],
  [OrderStatus.Shipping]: [OrderStatus.Delivered],
};

export const PaymentStatusTransitions = {
  [PaymentStatus.Pending]: [PaymentStatus.Paid, PaymentStatus.Failed, PaymentStatus.Cancelled],
};
