import { Body, Controller, Get, Inject, Post, Query, Request } from '@nestjs/common';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../../dbType/loginRegister';

@Controller('user')
export class UserController {

  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegiseterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Get()
  async getUser(@Query('id') id, @Request() req) {
    try {
      const userInfo = req.session.userInfo;
      if (userInfo && id === userInfo._id) { // session存在，同时用户id相等，在个人主页当中才为登录状态
        return {userInfo: req.session.userInfo, loginStatus: true};
      } else {
        const doc = await this.loginRegiseterRepository.findById(id);
        const user = doc.toObject();
        delete user.paw; // 删除密码，返回用户信息

        return { userInfo: user, loginStatus: false };
      }
    } catch (error) {
       return { userInfo: null, loginStatus: false };
    }
  }

  @Post()
  async setUserInfo(@Request() req, @Body() body) {
    const userInfo = _.cloneDeep(req.session.userInfo);
    if (!userInfo) return { retCode: 'fail', retMsg: '请重新登录', userInfo: null };
    const item = await this.loginRegiseterRepository.findOne({ userName: body.userName });
    if (item) {
      const obj = item.toObject();
      if (obj._id.toString().localeCompare(userInfo._id)) return {
        retCode: 'fail',
        retMsg: '用户名存在',
        userInfo: null,
      };
    }
    // 更新数据库信息
    await this.loginRegiseterRepository.updateOne(
      { _id: req.session.userInfo._id },
      { $set: { avatar: body.avatar, userName: body.userName, email: body.email }},
    );

    userInfo.avatar = body.avatar;
    userInfo.userName = body.userName;
    userInfo.email = body.email;

    req.session.userInfo = userInfo;
    return { retCode: 'success', retMsg: '修改成功', userInfo: null };
  }
}
