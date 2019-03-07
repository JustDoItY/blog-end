import { Connection } from 'mongoose';
import { DynamicSchema } from '../dbType/dynamic';

export const DynamicProvider = {
  // 数据库表句柄
  provide: 'dynamicRepositoryToken',
  useFactory: (connection: Connection) => connection.model('dynamic', DynamicSchema, 'dynamic'),
  inject: ['DbConnectionToken'],
};