import { Body, Controller, Delete, Post, Request, Get, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ArticleDocument } from '../../dbType/article';
import { CommentDocument } from '../../dbType/comment';

@Controller('articles')
export class ArticlesController {

  constructor(
    @Inject('articlesRepositoryToken')
    private readonly articlesRepository: Model<ArticleDocument>,
    @Inject('commentsRepositoryToken')
    private readonly commentsRepository: Model<CommentDocument>,
  ) {}

  @Post()
  async saveArticle(@Body() body, @Request() req) {
    // 如果处于登录状态，才会继续处理文章，如果未登录，直接返回，不予处理。
    if (req.session.userInfo) {
      // 如果有文章id，说明处于编辑状态，需要更新文章信息
      if (body.articleId) {
        await this.articlesRepository.updateOne(
          {_id: body.articleId}, // 用id查找文章
          {$set: {title: body.title, content: body.articleContent, subject: body.subject}}); // 更新标题和内容
      } else {
        const today = moment().set({hours : 0, minute: 0, second : 0});
        // 查询每日发表文章
        const articleLimitCount = await this.articlesRepository.countDocuments({
          userID: req.session.userInfo._id,
          writeDate: {
          $gt: new Date(today.format()),
          $lt: new Date(today.add(1, 'day').format())},
        });
        // 每天文章上限为2篇
        if (articleLimitCount > 2) return {retCode: 'fail', retMsg: '超过每日文章上限'};

        // 处于保存状态，向数据库插入文章
        await this.articlesRepository.insertMany({
          title: body.title,
          content: body.articleContent,
          writeDate: new Date(),
          subject: body.subject,
          good: 0,
          userID: req.session.userInfo._id });
      }
      return {retCode: 'success', retMsg: '保存成功'};
    } else {
      // 未处于登录状态，直接返回
      return {retCode: 'fail', retMsg: '请登录'};
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
    await this.commentsRepository.deleteMany({articleID: id}); // 删除评论内容
    return {retCode: 'success', retMsg: '删除成功'};
  }
}
