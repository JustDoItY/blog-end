import { Module } from '@nestjs/common';

// serivces
import { AppService } from './app.service';
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
} from './controllers';
// 数据库表
import {
  articlesProvider,
  LoginRegisterProvider,
  DynamicProvider,
  mytestProvider,
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
  ],
  providers: [
    AppService,
    AttentionProvider,
    mytestProvider,
    LoginRegisterProvider,
    articlesProvider,
    DynamicProvider,
    commentsProvider,
  ],
})
export class AppModule { }
