export enum GenderType {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  UNISEX = 'Unisex',
}

export const enum RoleType {
  CUSTOMER = 'Khách hàng',
  ADMIN = 'Quản trị viên',
}

export enum CouponStatus {
  ACTIVE = 'Hoạt động',
  INACTIVE = 'Không hoạt động',
  EXPIRED = 'Hết hạn',
}

export enum DiscountType {
  PERCENTAGE = 'Phần trăm',
  FIXED_AMOUNT = 'Số tiền',
}

export enum ColorsType {
  Black = 'Đen',
  White = 'Trắng',
  Gray = 'Xám',
  Brown = 'Nâu',
  Red = 'Đỏ',
  Yellow = 'Vàng',
  Orange = 'Cam',
  Pink = 'Hồng',
  Blue = 'Xanh dương',
  Green = 'Xanh lá',
  Purple = 'Tím',
  PastelPink = 'Hồng pastel',
  PastelBlue = 'Xanh pastel',
  PastelYellow = 'Vàng pastel',
  PastelPurple = 'Tím pastel',
}

export enum SizesType {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum PaymentMethod {
  Cod = 'Thanh toán khi nhận hàng',
  VNPay = 'Ví điện tử VNPay',
  Momo = 'Ví điện tử Momo',
}

export enum PaymentStatus {
  Pending = 'Chờ thanh toán',
  Paid = 'Đã thanh toán',
  Failed = 'Thất bại',
  Cancelled = 'Đã hủy',
  Refunded = 'Đã hoàn tiền',
}

export enum ShippingMethod {
  Standard = 'Giao hàng tiêu chuẩn',
  Express = 'Giao hàng nhanh',
  SameDay = 'Giao hàng hỏa tốc',
}
