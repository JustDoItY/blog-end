import { Connection } from 'mongoose';
import { ResSchema } from '../dbType/res';

export const mytestProvider = {
  // Token可以自己设定
  provide: 'ResRepositoryToken',
  useFactory: (connection: Connection) => connection.model('mytest', ResSchema),
  inject: ['DbConnectionToken'],
};
