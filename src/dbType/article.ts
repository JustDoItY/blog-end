import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ArticleDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  writeDate: Date;
  good: number;
  subject: string;
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
}

export const ArticleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  writeDate: Date,
  good: Number,
  subject: String,
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
});
