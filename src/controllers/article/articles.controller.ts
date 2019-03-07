import { Body, Controller, Delete, Post, Request, Get, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as _ from 'lodash';

import { ArticleDocument } from '../../dbType/article';

@Controller('articles')
export class ArticlesController {

  constructor(
    @Inject('articlesRepositoryToken')
    private readonly articlesRepository: Model<ArticleDocument>,
  ) {}

  @Post()
  async saveArticle(@Body() body, @Request() req) {
    if (req.session.userInfo) {
      if (body.articleId) {
        await this.articlesRepository.updateOne(
          {_id: body.articleId},
          {$set: {title: body.title, content: body.articleContent}});
      } else {
        await this.articlesRepository.insertMany({
          title: body.title,
          content: body.articleContent,
          writeDate: new Date(),
          good: 0,
          userID: req.session.userInfo._id });
      }
      return {retCode: 'success', retMsg: '保存成功'};
    } else {
      return {retCode: 'fail', retMsg: '请重新登录'};
    }
  }

  @Get()
  async getArticlesByUser(@Query() query, @Request() req) {
    let edit = false;
    // 登录用户查询个人文章数据
    const userInfo = req.session.userInfo;
    if (userInfo &&  query.id === userInfo._id) edit = true;
    const articles = await this.articlesRepository.find({userID: query.id}).populate('userID', {userName: 1}).sort({writeDate: -1}).exec();
    return {articles, edit};
  }

  @Delete()
  async deleteArticle(@Query('id') id, @Request() req) {
    const userInfo = req.session.userInfo;
    if (!userInfo) return {articles: null, retCode: 'fail', retMsg: '请重新登录'};
    await this.articlesRepository.deleteOne({_id: id});
    const articles = await this.articlesRepository.find({userID: userInfo._id}).populate('userID', {userName: 1}).sort({writeDate: -1}).exec();
    return {content: articles, retCode: 'success', retMsg: '删除成功'};
  }
}
