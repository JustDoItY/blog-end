import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../dbType/loginRegister';
@Controller('loginRegister')
export class LoginRegisterController {
  userInfo = null;
  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegisterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Post()
  async user(@Body() body, @Request() req) {
    this.userInfo = _.cloneDeep(body.userInfo);
    this.userInfo.paw = this.crypto(this.userInfo.paw);

    try {
      let documemt;
      // 判断用户登录类型，如果是邮箱登录，就会以邮箱搜索用户，否则用用户名搜索
      if (body.loginType === 'email') {
        documemt = await this.loginRegisterRepository.findOne({email: {$eq: this.userInfo.userName}});
      } else {
        documemt = await this.loginRegisterRepository.findOne({userName: {$eq: this.userInfo.userName}});
      }
      if (body.loginStatus) { // 登陆状态，查询用户信息
        if (documemt) {
          // 判断密码是否正确
          if (this.userInfo.paw !== documemt.paw) return this.information('faild', '密码不正确');
          // 设置session
          const doc = documemt.toObject();
          delete doc.paw; // 删除密码，返回用户信息
          req.session.userInfo = doc;
          return this.information('success', '登陆成功', doc);
        } else {
          return this.information('faild', '未注册');
        }
      } else { // 注册
        if (documemt) return this.information('faild', '已注册，请尝试登录');
        // 如果当前用户名不存在用户，再次核查邮箱是否被注册，如果邮箱未被注册，继续注册
        const emailVerify = await this.loginRegisterRepository.findOne({email: {$eq: this.userInfo.email}});
        if (emailVerify) return this.information('fail', '该邮箱已被注册');
        // 注册用户信息
        this.userInfo.registerDate = new Date();
        this.userInfo.avatar = '';
        await this.loginRegisterRepository.insertMany(this.userInfo);
        return this.information('success', '注册成功，请登陆');
      }
    } catch (error) {
      return this.information('faild', '登陆失败，请重新尝试');
    }
  }

  @Delete()
  deleteSession(@Request() req) {
    req.session.userInfo = null;
    return this.information('success', '删除成功');
  }

  @Get()
  getSession(@Request() req) {
    if (req.session.userInfo) { // 有session情况
      return this.information('success', '登陆成功', req.session.userInfo);
    } else {
      return this.information('faild', '请重新登录');
    }
  }

  information(status, tip, userInfo = null) {
    const res = { retMsg: null, retCode: null, content: null };
    res.retCode = status;
    res.retMsg = tip;
    res.content = userInfo;

    return res;
  }

  crypto(text: string) {
    return crypto.createHmac('sha256', 'zanguokuan')
                  .update(text)
                  .digest('hex');
  }
}
