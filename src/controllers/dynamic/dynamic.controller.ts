import { Body, Controller, Post, Request, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { DynamicDocument } from '../../dbType/dynamic';

@Controller('dynamic')
export class DynamicController {
  constructor(
    @Inject('dynamicRepositoryToken')
    private readonly dynamicRepository: Model<DynamicDocument>,
  ) {}

  @Post()
  async saveDynamic(@Body() body, @Request() req) {
    await this.dynamicRepository.insertMany({
      content: body.dynamic,
      writeDate: new Date(),
      good: 0,
      userID: req.session.userInfo._id });
    const dynamics = await this.dynamicRepository.find({}).populate('userID', {userName: 1}).sort({writeDate: -1}).exec();
    return {retCode: 'success', retMsg: '发布成功', content: dynamics};
  }

  @Get()
  async getDynamics() {
    const dynamics = await this.dynamicRepository.find({}).populate('userID', {userName: 1}).sort({writeDate: -1}).exec();
    return {retCode: 'success', retMsg: '', content: dynamics};
  }
}
