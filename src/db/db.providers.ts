import * as mongoose from 'mongoose';

export const dbProviders = [
  {
    // Token可以自己设定
    provide: 'DbConnectionToken',
    useFactory: async () =>
    await mongoose.connect('mongodb://blog:zanguokuan@localhost/blogDatabase'),
  },
];
