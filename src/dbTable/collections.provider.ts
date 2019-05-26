import { Connection } from 'mongoose';
import { CollectionSchema } from '../dbType/collection';

export const CollectionProvider = {
  // 数据库表句柄
  provide: 'collectionRepositoryToken',
  useFactory: (connection: Connection) => connection.model('collection', CollectionSchema, 'collection'),
  inject: ['DbConnectionToken'],
};