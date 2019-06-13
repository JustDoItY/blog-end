import { Body, Controller, Post, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { ArticleDocument } from '../../dbType/article';
import { LikesDocument } from '../../dbType/likes';

@Controller('articlepointGood')
export class ArticlePointGoodController {
  constructor(
    @Inject('articlesRepositoryToken')
    private readonly articlesRepository: Model<ArticleDocument>,
    @Inject('likesRecordRepositoryToken')
    private readonly LikesRepository: Model<LikesDocument>,
  ) {}

  @Post()
  async pointGood(@Body() body, @Request() req) {
    const userInfo = req.session.userInfo;
    if (!userInfo) return { retCode: 'fail', retMsg: '请登录后再点赞' };
    if (userInfo && body.authorId === userInfo._id) return { retCode: 'fail', retMsg: '请不要给自己点赞' };
    // 检查每日用户点赞数量
    const today = moment().set({hours : 0, minute: 0, second : 0});
    const likesCount = await this.LikesRepository.count({
      userID: userInfo._id,
      infoType: 'article',
      date: {
        $gt: new Date(today.format()),
        $lt: new Date(today.add(1, 'day').format())},
      });
    // 每天只有10次机会，超出就不能继续
    if (likesCount >= 10) return { retCode: 'fail', retMsg: '超出10次点赞机会' };

    const item = await this.articlesRepository.findByIdAndUpdate(body.articleId, { $inc: {good: 1} });
    // 插入点赞记录表
    await this.LikesRepository.insertMany({
      authorID: body.authorId,
      userID: userInfo._id,
      infoID: body.articleId,
      infoType: 'article',
      date: new Date()});
    return { retCode: 'success', retMsg: '点赞成功', content: (item.good || 0) + 1};
  }
}
