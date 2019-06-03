import { Body, Controller, Post, Request, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../dbType/loginRegister';

import { SendEmailService } from '../helpers/emailSend..service';

@Controller('emailcode')
export class EmailController {

  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegisterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Post()
  async sendEmailRegisterCode(@Request() req, @Body() body) {
    // 校验用户是否存在
    const document = await this.loginRegisterRepository.findOne({email: body.eml});
    if (!document) return {retCode: 'fail', retMsg: '用户不存在'};

    const code = this.makeCode(); // 生成校验码，4位

    return SendEmailService.sendMSg(`欢迎使用个人博客系统，您本次的验证码为：${code}，一分钟有效时间`, body.eml, '个人博客校验码', code);
  }

  makeCode(){
    let code = '';
    // 随机选取0-9数字
    for (let i = 0; i < 4; i++) {
      code  = Math.floor(Math.random() * 9).toString() + code;
    }
    return code;
  }
}
