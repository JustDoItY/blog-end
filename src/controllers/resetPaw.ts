import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../dbType/loginRegister';
@Controller('resetpaw')
export class ResetPawController {
  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegiseterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Post()
  async setPaw(@Body() body){

    try {
      const res = await this.loginRegiseterRepository.updateOne({email: body.emailAddress}, {$set: {paw: this.crypto(body.paw)}});
      if (res) {
        return {retCode: 'success', retMsg: '更新成功'};
      } else {
        return {retCode: 'fail', retMsg: '用户不存在'};
      }
    } catch (error) {
      return {retCode: 'fail', retMsg: '更新失败，未知原因'};
    }
  }

  crypto(text: string) {
    return crypto.createHmac('sha256', 'zanguokuan')
                  .update(text)
                  .digest('hex');
  }
}
