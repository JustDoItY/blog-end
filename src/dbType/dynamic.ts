import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface DynamicDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  content: string;
  writeDate: Date;
  good: number;
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
}

export const DynamicSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: String,
  writeDate: Date,
  good: Number,
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
});