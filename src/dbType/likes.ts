import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface LikesDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
  infoID: string; // 被评论信息id
  infoType: string; // 被评论信息类型
  date: Date;
}

export const LikesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
  infoID: String,
  type: String,
  date: Date,
});