import { Body, Controller, Post, Request, Get, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as _ from 'lodash';

import { CommentDocument } from '../../dbType/comment';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject('commentsRepositoryToken')
    private readonly commentsRepository: Model<CommentDocument>,
  ) {}

  @Post()
  async saveComment(@Body() body, @Request() req) {
    if (!req.session.userInfo) return { retCode: 'fail', retMsg: '请登录后评论', content: null };
    const comment = _.cloneDeep(body);
    comment.writeDate = new Date();
    await this.commentsRepository.insertMany(comment);
    const content = await this.commentsRepository.find({articleID: body.articleID})
                          .populate('fromID', {userName: 1, avatar: 1}).sort({writeDate: -1});
    return { retCode: 'success', retMsg: '保存成功', content };
  }

  @Get()
  async getComments(@Query() query) {
    if (!query.articleID) return { retCode: 'fail', retMsg: '', content: null };
    const content = await this.commentsRepository.find({articleID: query.articleID})
                          .populate('fromID', {userName: 1, avatar: 1}).sort({writeDate: -1});
    return { retCode: 'success', retMsg: '', content };
  }
}