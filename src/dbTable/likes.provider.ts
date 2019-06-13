import { Connection } from 'mongoose';
import { LikesSchema } from '../dbType/likes';

export const LikesProvider = {
  // 数据库表句柄
  provide: 'likesRecordRepositoryToken',
  useFactory: (connection: Connection) => connection.model('likesRecord', LikesSchema, 'likesRecord'),
  inject: ['DbConnectionToken'],
};