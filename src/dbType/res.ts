import { ObjectID } from 'bson';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ResDocument extends Document {
  _id: ObjectID;
  ip: string;
  date: Date;
  method: string;
  path: string;
  http: string;
  statusCode: string;
  body: string;
  url: string;
  userAgent: object;
}
export interface ResModel {
  _id: ObjectID;
  ip: string;
  date: Date;
  method: string;
  path: string;
  http: string;
  statusCode: string;
  body: string;
  url: string;
  userAgent: object;
}

export const ResSchema = new mongoose.Schema({
  _id: ObjectID,
  ip: String,
  date: Date,
  method: String,
  path: String,
  http: String,
  statusCode: String,
  body: String,
  url: String,
  userAgent: Object,
});
