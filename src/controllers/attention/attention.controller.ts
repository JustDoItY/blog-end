import { Body, Controller, Post, Query, Get, Delete } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { AttentionDocument } from '../../dbType/attention';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('attention')
export class AttentionController {
  constructor(
    @Inject('attentionRepositoryToken')
    private readonly attentionRepository: Model<AttentionDocument>,
  ) {}

  @Get()
  async getAttention(@Query('follower') follower) {
    const attentionInfo = await this.attentionRepository.find({follower})
                                .populate('followedPerson', {userName: 1, avatar: 1});
    return {retCode: 'success', retMsg: '成功', content: attentionInfo};
  }

  @Post()
  async saveAttention(@Body() body) {
    const item = await this.attentionRepository.findOne(body);
    if (item) return {retCode: 'fail', retMsg: '请不要重复关注', content: null};
    const attentionInfo = await this.attentionRepository.insertMany(body);
    return {retCode: 'success', retMsg: '关注成功', content: null};
  }

  @Delete()
  async deleteFollower(@Query('id') id) {
    try {
      const item = await this.attentionRepository.findByIdAndDelete(id);
      return {retCode: 'success', retMsg: '取消关注成功', content: null};
    } catch (error) {
      return {retCode: 'faild', retMsg: '未知原因', content: null};
    }
  }
}
