import { Connection } from 'mongoose';
import { LoginRegisterSchema } from '../dbType/loginRegister';

export const LoginRegisterProvider = {
  // 数据库表句柄
  provide: 'loginRegisterRepositoryToken',
  useFactory: (connection: Connection) => connection.model('logins', LoginRegisterSchema, 'logins'),
  inject: ['DbConnectionToken'],
};
