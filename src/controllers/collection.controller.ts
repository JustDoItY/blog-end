import { Body, Controller, Delete, Get, Post, Request, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import * as _ from 'lodash';
import { Model } from 'mongoose';

import { CollectionDocument } from '../dbType/collection';

@Controller('collect')
export class CollectionController {
  constructor(
    @Inject('collectionRepositoryToken')
    private readonly collectionRepository: Model<CollectionDocument>,
  ) {}

  @Post()
  async addCollection(@Body() body){
    try {
      const document = {articleID: body.articleId, collectorID: body.collector, authorID: body.authorID};
      // 对收藏文章进行搜索，如果搜到，说明已被收藏
      const res = await this.collectionRepository.findOne(document);
      if (res) return {retCode: 'faild', retMsg: '请不要重复收藏'};
      // 插入数据库
      const item = await this.collectionRepository.insertMany(document);
      return {retCode: 'success', retMsg: '收藏成功'};
    } catch (error) {
      return {retCode: 'faild', retMsg: '未知'};
    }
  }

  @Get()
  async getCollections(@Query('collector') collector) {
    try {
      const documents = await this.collectionRepository.find({collectorID: collector})
                                                        .populate('articleID').populate('authorID');

      if (documents.length) {
        // 处理已被删除的文章
        documents.forEach(async (document, i) => {
          if (!document.articleID) {
            documents.splice(i, 1);
            await this.collectionRepository.findByIdAndDelete(document._id);
          }
        });

        return {retCode: 'success', retMsg: '查找成功', content: documents};
      }
      else return {retCode: 'faild', retMsg: '查找失败'};
    } catch (error) {
      return {retCode: 'faild', retMsg: '未知'};
    }
  }

  @Delete()
  async deleteCollection(@Query('collectionId') collectionId) {
    try {
      const document = await this.collectionRepository.findByIdAndDelete(collectionId);
      if (document) return {retCode: 'success', retMsg: '删除成功'};
      else return {retCode: 'faild', retMsg: '删除失败'};
    } catch (error) {
      return {retCode: 'faild', retMsg: '未知'};
    }
  }
}