import { Body, Controller, Post, Request, Get, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as _ from 'lodash';

import { CommentDocument } from '../../dbType/comment';
import { LoginRegisterDocument } from '../../dbType/loginRegister';
import { SendEmailService } from '../../helpers/emailSend..service';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject('commentsRepositoryToken')
    private readonly commentsRepository: Model<CommentDocument>,
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegisterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Post()
  async saveComment(@Body() body, @Request() req) {
    // 处于非登录状态，不可评论
    if (!req.session.userInfo) return { retCode: 'fail', retMsg: '请登录后评论', content: null };
    const comment = _.cloneDeep(body);
    comment.writeDate = new Date();
    // 保存评论信息
    await this.commentsRepository.insertMany(comment);
    const content = await this.commentsRepository.find({articleID: body.articleID})
    .populate('fromID', {userName: 1, avatar: 1}).sort({writeDate: -1});

    // 对用户发送评论信息
    const fromUser = await this.loginRegisterRepository.findById(comment.fromID);
    const toUser = await this.loginRegisterRepository.findById(comment.toID);
    SendEmailService.sendMSg(`${fromUser.userName}:${comment.content}`, toUser.email, '个人博客评论');
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