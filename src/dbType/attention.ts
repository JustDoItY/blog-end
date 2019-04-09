import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface AttentionDocument extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  followedPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  };
}

export const AttentionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  followedPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
  },
});
