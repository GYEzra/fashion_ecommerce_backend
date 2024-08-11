export interface Response<T> {
  author: string;
  statusCode: number;
  message: string;
  data: T;
}
