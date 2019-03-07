import { Body, Controller, Post, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { ArticleDocument } from '../../dbType/article';

@Controller('articlepointGood')
export class ArticlePointGoodController {
  constructor(
    @Inject('articlesRepositoryToken')
    private readonly articlesRepository: Model<ArticleDocument>,
  ) {}

  @Post()
  async pointGood(@Body() body, @Request() req) {
    const userInfo = req.session.userInfo;
    if (!userInfo) return { retCode: 'fail', retMsg: '请登录后再点赞' };
    if (userInfo && body.userId === userInfo._id) return { retCode: 'fail', retMsg: '请不要给自己点赞' };

    const item = await this.articlesRepository.findByIdAndUpdate(body.id, { $inc: {good: 1} });
    return { retCode: 'success', retMsg: '点赞成功', content: (item.good || 0) + 1};
  }
}
