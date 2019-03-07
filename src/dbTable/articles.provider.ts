import { Connection } from 'mongoose';
import { ArticleSchema } from '../dbType/article';

export const articlesProvider = {
  // 数据库表句柄
  provide: 'articlesRepositoryToken',
  useFactory: (connection: Connection) => connection.model('articles', ArticleSchema, 'articles'),
  inject: ['DbConnectionToken'],
};
