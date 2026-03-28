/**
 * 云开发数据库操作封装
 * 注意：uni-app 中使用 wx.cloud 需要在微信小程序环境下
 * 开发阶段可使用 mock 数据
 */

import { COLLECTIONS } from './config'

// 判断是否在微信小程序环境
export const isWxCloud = () => {
  return typeof wx !== 'undefined' && wx.cloud
}

// 初始化云开发
export const initCloud = () => {
  if (isWxCloud()) {
    const { CLOUD_ENV } = require('./config')
    wx.cloud.init({
      env: CLOUD_ENV,
      traceUser: true
    })
  }
}

// 获取数据库引用
export const getDB = () => {
  if (isWxCloud()) {
    return wx.cloud.database()
  }
  return null
}

// 通用查询方法
export const db = {
  // 添加记录
  async add(collection: string, data: any) {
    if (isWxCloud()) {
      const database = getDB()
      const res = await database.collection(collection).add({ data })
      return { id: res._id, ...data }
    }
    // Mock: 返回模拟数据
    return { id: 'mock_' + Date.now(), ...data }
  },

  // 查询单条
  async getOne(collection: string, id: string) {
    if (isWxCloud()) {
      const database = getDB()
      const res = await database.collection(collection).doc(id).get()
      return res.data
    }
    return null
  },

  // 条件查询
  async query(collection: string, where: any = {}, orderBy: string = 'createTime', order: string = 'desc', limit: number = 20, skip: number = 0) {
    if (isWxCloud()) {
      const database = getDB()
      let query = database.collection(collection)
      if (Object.keys(where).length > 0) {
        query = query.where(where)
      }
      const res = await query
        .orderBy(orderBy, order)
        .skip(skip)
        .limit(limit)
        .get()
      return res.data
    }
    return []
  },

  // 更新记录
  async update(collection: string, id: string, data: any) {
    if (isWxCloud()) {
      const database = getDB()
      await database.collection(collection).doc(id).update({ data })
      return true
    }
    return true
  },

  // 删除记录
  async remove(collection: string, id: string) {
    if (isWxCloud()) {
      const database = getDB()
      await database.collection(collection).doc(id).remove()
      return true
    }
    return true
  },

  // 统计数量
  async count(collection: string, where: any = {}) {
    if (isWxCloud()) {
      const database = getDB()
      const res = await database.collection(collection).where(where).count()
      return res.total
    }
    return 0
  }
}
