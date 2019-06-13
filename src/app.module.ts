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
  CollectionController,
} from './controllers';
// 数据库表
import {
  articlesProvider,
  LoginRegisterProvider,
  DynamicProvider,
  commentsProvider,
  AttentionProvider,
  CollectionProvider,
  LikesProvider,
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
    CollectionController,
  ],
  providers: [
    AttentionProvider,
    LoginRegisterProvider,
    articlesProvider,
    DynamicProvider,
    commentsProvider,
    CollectionProvider,
    LikesProvider,
  ],
})
export class AppModule { }
