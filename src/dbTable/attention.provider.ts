import { Connection } from 'mongoose';
import { AttentionSchema } from '../dbType/attention';

export const AttentionProvider = {
  // 数据库表句柄
  provide: 'attentionRepositoryToken',
  useFactory: (connection: Connection) => connection.model('attention', AttentionSchema, 'attention'),
  inject: ['DbConnectionToken'],
};