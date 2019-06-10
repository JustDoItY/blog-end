import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { ArticleDocument } from '../../dbType/article';

@Controller('search')
export class SearchController {

  constructor(
    @Inject('articlesRepositoryToken')
    private readonly articlesRepository: Model<ArticleDocument>,
  ) {}

  @Get()
  async findPage(@Query('pageIndex') pageIndex, @Query('field') field, @Query('subject') subject) {
    const reg = {title: {$regex: field, $options: 'i'}, subject: {$regex: subject === 'all' ? '' : subject, $options: 'i'}};

    const count = await this.articlesRepository.count(reg);
    const articles = await this.articlesRepository.find(reg, { title: 1, writeDate: 1, good: 1, subject })
                     .populate('userID', { userName: 1, avatar: 1 }).sort({writeDate: -1}).skip((pageIndex - 1) * 5).limit(5).exec();
    return {articles, total: Math.ceil(count / 5), field};
  }

  @Post()
  async findOne(@Body('id') id, @Request() req) {
    let loginID = '';
    let avatar = '';
    if (req.session.userInfo) {
      loginID = req.session.userInfo._id; // 返回用户ID，如果登录状态
      avatar = req.session.userInfo.avatar;
    }
    const article = await this.articlesRepository.findById(id).populate('userID', { userName: 1, avatar: 1 }).exec();
    if (article) {
      return {retCode: 'success', retMsg: '查询成功', content: article, loginID, avatar};
    } else {
      return {retCode: 'faild', retMsg: '文章已被删除', content: null};
    }
  }
}
