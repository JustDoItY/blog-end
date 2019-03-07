import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface LoginRegisterDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  userName: string;
  paw: string;
  registerDate: Date;
  avatar: string;
  email: string;
}

export const LoginRegisterSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  paw: String,
  registerDate: Date,
  avatar: String,
  email: String,
});
