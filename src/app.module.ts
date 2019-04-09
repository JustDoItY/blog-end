import { Module } from '@nestjs/common';

// serivces
import {DbModule} from './db/db.module';

import {
  ArticlesController,
  LoginRegisterController,
  SearchController,
  UserController,
  DynamicController,
  ArticlePointGoodController,
  AttentionController,
  DynamicPointGoodController,
  CommentController,
  EmailController,
  ResetPawController,
} from './controllers';
// 数据库表
import {
  articlesProvider,
  LoginRegisterProvider,
  DynamicProvider,
  commentsProvider,
  AttentionProvider,
} from './dbTable';

@Module({
  imports: [DbModule],
  controllers: [
    DynamicController,
    SearchController,
    LoginRegisterController,
    ArticlesController,
    UserController,
    ArticlePointGoodController,
    AttentionController,
    DynamicPointGoodController,
    CommentController,
    EmailController,
    ResetPawController,
  ],
  providers: [
    AttentionProvider,
    LoginRegisterProvider,
    articlesProvider,
    DynamicProvider,
    commentsProvider,
  ],
})
export class AppModule { }
