import { Body, Controller, Get, Inject, Post, Query, Request } from '@nestjs/common';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { LoginRegisterDocument } from '../../dbType/loginRegister';

@Controller('user')
export class UserController {

  constructor(
    @Inject('loginRegisterRepositoryToken')
    private readonly loginRegisterRepository: Model<LoginRegisterDocument>,
  ) {}

  @Get()
  async getUser(@Query('id') id, @Request() req) {
    try {
      let fromID = ''; // 非登录用户和登录用户获取信息，fromID为空
      let edit = false; // 是否可编辑信息
      let loginStatus = false; // 是否登录状态
      const userInfo = req.session.userInfo;
      if (userInfo) {
        loginStatus = true;
        if (id === userInfo._id) { // session存在，同时用户id相等，获取个人信息
          edit = true;
          return {userInfo, edit, loginStatus, fromID};
        } else { // 登录用户，非个人主页，作为潜在关注者
          fromID = userInfo._id;
        }
      }

      // 非登录用户
      const doc = await this.loginRegisterRepository.findOne({_id: id.toString()});
      const user = doc.toObject();
      delete user.paw; // 删除密码，返回用户信息
      return { userInfo: user, edit, loginStatus, fromID };
    } catch (error) {
       return { userInfo: null, loginStatus: false };
    }
  }

  @Post()
  async setUserInfo(@Request() req, @Body() body) {
    try {
      const userInfo = _.cloneDeep(req.session.userInfo);
      if (!userInfo) return { retCode: 'fail', retMsg: '请重新登录', userInfo: null };
      // 根据用户名查询用户
      const item = await this.loginRegisterRepository.findOne({ userName: body.userName });
      // 根据邮箱查询用户
      const emailVerify = await this.loginRegisterRepository.findOne({email: {$eq: body.email}});
      // 以下两个if语句，都通过才可以更新信息，否则不可以
      if (item) {
        const obj = item.toObject();
        // 两个用户id不同，说明不是当前用户，故用户名已被注册
        if (obj._id.toString().localeCompare(userInfo._id)) return {
          retCode: 'fail',
          retMsg: '用户名存在',
          userInfo: null,
        };
      }
      if (emailVerify) {
        const obj = emailVerify.toObject();
         // 两个用户id不同，说明不是当前用户，故邮箱已被注册
        if (obj._id.toString().localeCompare(userInfo._id)) return {
          retCode: 'fail',
          retMsg: '修改失败，该邮箱已被注册',
          userInfo: null,
        };
      }
      // 更新数据库信息
      await this.loginRegisterRepository.updateOne(
        { _id: req.session.userInfo._id },
        { $set: { avatar: body.avatar, userName: body.userName, email: body.email }},
      );

      userInfo.avatar = body.avatar;
      userInfo.userName = body.userName;
      userInfo.email = body.email;

      req.session.userInfo = userInfo;
      return { retCode: 'success', retMsg: '修改成功', userInfo: null };
    } catch (error) {
      return { retCode: 'fail', retMsg: '未知原因', userInfo: null };
    }
  }
}
