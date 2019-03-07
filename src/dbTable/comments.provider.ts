import { Connection } from 'mongoose';
import { CommentSchema } from '../dbType/comment';

export const commentsProvider = {
  // 数据库表句柄
  provide: 'commentsRepositoryToken',
  useFactory: (connection: Connection) => connection.model('comments', CommentSchema, 'comments'),
  inject: ['DbConnectionToken'],
};
