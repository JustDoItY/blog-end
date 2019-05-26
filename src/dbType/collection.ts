import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface CollectionDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  };
  collectorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
}

export const CollectionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
  },
  collectorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
});