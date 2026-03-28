/**
 * 抽奖数据 Mock（开发阶段使用，接入云开发后替换为真实数据）
 */

import { generateId, formatTime } from './common'
import { LOTTERY_STATUS } from './config'

// Mock 用户
export const mockUsers = [
  { _id: 'u1', nickName: '小明', avatarUrl: '', openId: 'o1' },
  { _id: 'u2', nickName: '小红', avatarUrl: '', openId: 'o2' },
  { _id: 'u3', nickName: '小刚', avatarUrl: '', openId: 'o3' },
  { _id: 'u4', nickName: '小丽', avatarUrl: '', openId: 'o4' },
  { _id: 'u5', nickName: '阿强', avatarUrl: '', openId: 'o5' },
  { _id: 'u6', nickName: '小芳', avatarUrl: '', openId: 'o6' },
  { _id: 'u7', nickName: '大伟', avatarUrl: '', openId: 'o7' },
  { _id: 'u8', nickName: '小雪', avatarUrl: '', openId: 'o8' },
]

// Mock 抽奖活动
export const mockLotteries = [
  {
    _id: 'l1',
    title: '🎉 新年抽奖活动',
    description: '新年快乐！参与抽奖赢取精美礼品',
    prizes: [
      { name: '一等奖：AirPods Pro', count: 1, image: '' },
      { name: '二等奖：京东卡200元', count: 3, image: '' },
      { name: '三等奖：精美笔记本', count: 5, image: '' },
    ],
    totalCount: 9,
    participantCount: 15,
    status: LOTTERY_STATUS.ACTIVE,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createTime: formatTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    creatorId: 'u1',
    creatorName: '小明',
    creatorAvatar: '',
    winners: [],
    participants: ['u1', 'u2', 'u3', 'u4', 'u5'],
    joinLimit: 0, // 0 = 不限
    isPublic: true,
  },
  {
    _id: 'l2',
    title: '🎁 粉丝福利抽奖',
    description: '感谢大家的关注，送出精美周边',
    prizes: [
      { name: '定制T恤', count: 2, image: '' },
      { name: '手机壳', count: 5, image: '' },
    ],
    totalCount: 7,
    participantCount: 23,
    status: LOTTERY_STATUS.ACTIVE,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createTime: formatTime(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    creatorId: 'u2',
    creatorName: '小红',
    creatorAvatar: '',
    winners: [],
    participants: ['u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    joinLimit: 0,
    isPublic: true,
  },
  {
    _id: 'l3',
    title: '🏆 团建抽奖',
    description: '公司团建活动抽奖环节',
    prizes: [
      { name: '特等奖：iPhone 16', count: 1, image: '' },
      { name: '一等奖：iPad', count: 2, image: '' },
      { name: '二等奖：充电宝', count: 5, image: '' },
      { name: '参与奖：钥匙扣', count: 10, image: '' },
    ],
    totalCount: 18,
    participantCount: 30,
    status: LOTTERY_STATUS.FINISHED,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createTime: formatTime(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    creatorId: 'u3',
    creatorName: '小刚',
    creatorAvatar: '',
    winners: [
      { prize: '特等奖：iPhone 16', userId: 'u1', userName: '小明' },
      { prize: '一等奖：iPad', userId: 'u4', userName: '小丽' },
      { prize: '一等奖：iPad', userId: 'u6', userName: '小芳' },
    ],
    participants: mockUsers.map(u => u._id),
    joinLimit: 0,
    isPublic: true,
  },
  {
    _id: 'l4',
    title: '🎊 生日派对抽奖',
    description: '我的生日派对，来抽个奖吧！',
    prizes: [
      { name: '神秘大礼', count: 1, image: '' },
      { name: '精美小礼品', count: 3, image: '' },
    ],
    totalCount: 4,
    participantCount: 8,
    status: LOTTERY_STATUS.PENDING,
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createTime: formatTime(new Date()),
    creatorId: 'u5',
    creatorName: '阿强',
    creatorAvatar: '',
    winners: [],
    participants: ['u5'],
    joinLimit: 50,
    isPublic: true,
  },
]

// Mock 操作函数
const storage = {
  lotteries: [...mockLotteries],
}

export const mockDB = {
  // 获取抽奖列表
  getLotteries: (status?: number) => {
    if (status !== undefined) {
      return storage.lotteries.filter(l => l.status === status)
    }
    return [...storage.lotteries].sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    )
  },

  // 获取抽奖详情
  getLotteryDetail: (id: string) => {
    return storage.lotteries.find(l => l._id === id) || null
  },

  // 创建抽奖
  createLottery: (data: any) => {
    const lottery = {
      _id: generateId(),
      ...data,
      participantCount: 0,
      winners: [],
      participants: [],
      createTime: formatTime(new Date()),
    }
    storage.lotteries.unshift(lottery)
    return lottery
  },

  // 参与抽奖
  joinLottery: (lotteryId: string, userId: string) => {
    const lottery = storage.lotteries.find(l => l._id === lotteryId)
    if (!lottery) return false
    if (lottery.participants.includes(userId)) return false
    lottery.participants.push(userId)
    lottery.participantCount = lottery.participants.length
    return true
  },

  // 开奖
  drawLottery: (lotteryId: string) => {
    const lottery = storage.lotteries.find(l => l._id === lotteryId)
    if (!lottery) return null

    const winners: any[] = []
    lottery.prizes.forEach((prize: any) => {
      const available = lottery.participants.filter(
        (p: string) => !winners.find(w => w.userId === p)
      )
      const picked = available
        .sort(() => Math.random() - 0.5)
        .slice(0, prize.count)
      picked.forEach((userId: string) => {
        const user = mockUsers.find(u => u._id === userId)
        winners.push({
          prize: prize.name,
          userId,
          userName: user?.nickName || '未知用户',
        })
      })
    })

    lottery.winners = winners
    lottery.status = LOTTERY_STATUS.FINISHED
    return winners
  },

  // 获取我创建的抽奖
  getMyLotteries: (userId: string) => {
    return storage.lotteries.filter(l => l.creatorId === userId)
  },

  // 获取我参与的抽奖
  getJoinedLotteries: (userId: string) => {
    return storage.lotteries.filter(l => l.participants.includes(userId))
  },

  // 取消抽奖
  cancelLottery: (lotteryId: string) => {
    const lottery = storage.lotteries.find(l => l._id === lotteryId)
    if (!lottery) return false
    lottery.status = LOTTERY_STATUS.CANCELLED
    return true
  },
}
