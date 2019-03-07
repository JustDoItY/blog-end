import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface CommentDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  commentType: string;
  content: string;
  writeDate: Date;
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  };
  fromID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
  toID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
}

export const CommentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  commentType: String,
  content: String,
  writeDate: Date,
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  },
  fromID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
  toID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
});
