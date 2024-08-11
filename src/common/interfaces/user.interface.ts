import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullname: string;
  address?: string;
  role?: string;
}
