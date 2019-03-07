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
  async findPage(@Query() query) {
    const articles = await this.articlesRepository.find({}, { title: 1, writeDate: 1, good: 1 })
                     .populate('userID', { userName: 1, avatar: 1 }).sort({writeDate: -1}).exec();
    return {articles};
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    let loginID = '';
    let avatar = '';
    if (req.session.userInfo) {
      loginID = req.session.userInfo._id; // 返回用户ID，如果登录状态
      avatar = req.session.userInfo.avatar;
    }
    const article = await this.articlesRepository.findById(id).populate('userID', { userName: 1, avatar: 1 }).exec();
    return {article, loginID, avatar};
  }

  @Post()
  async searchByField(@Body() body) {
    const articles = await this.articlesRepository.find({title: {$regex: body.field, $options: 'i'}})
                           .populate('userID', { userName: 1, avatar: 1 }).sort({writeDate: -1}).exec();
    return {articles};
  }
}
