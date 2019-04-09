import { Body, Controller, Post, Request, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../dbType/loginRegister';
@Controller('emailcode')
export class EmailController {

  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegiseterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Post()
  async sendEmailRegisterCode(@Request() req, @Body() body) {
    // 校验用户是否存在

    const document = await this.loginRegiseterRepository.findOne({email: body.eml});
    if (!document) return {retCode: 'fail', retMsg: '用户不存在'};

    const code = this.makeCode(); // 生成校验码，4位
    const mailOption = {
      from: '2930298153@qq.com',
      to: body.eml, // 收件人
      subject: '个人博客校验码', // 纯文本
      html: `<h1>欢迎使用个人博客系统，您本次的验证码为：${code}，一分钟有效时间</h1>`,
    };
    const res = {retCode: '', retMsg: '', content: ''};

    return new Promise((resolve) => {
      nodemailer.createTransport({ // 邮件传输
        service: 'qq',
        port: 456,
        secure: false,
        auth: {
          user: '2930298153@qq.com',
          pass: 'lsekqawgktufddab',
        },
      }).sendMail(mailOption, (error) => {
        if (error) {
          res.retCode = 'fail';
          res.retMsg = '发送失败，请重新发送';
          res.content = null;
        } else {
          res.retCode = 'success';
          res.content = code;
          res.retMsg = '发送成功';
        }
        resolve(res);
      });
    });
  }

  makeCode(){
    let code = '';

    for (let i = 0; i < 4; i++) {
      code  = Math.floor(Math.random() * 9).toString() + code;
    }
    return code;
  }
}
