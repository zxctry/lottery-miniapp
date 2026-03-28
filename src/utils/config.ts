// 云开发环境配置
// 在微信开发者工具中开通云开发后，填入你的环境ID
export const CLOUD_ENV = 'cloudbase-2gucprzrd5564bca'

// 云数据库集合名
export const COLLECTIONS = {
  LOTTERY: 'lotteries',
  PARTICIPANT: 'participants',
  USER: 'users'
}

// 抽奖状态
export const LOTTERY_STATUS = {
  PENDING: 0,    // 未开始
  ACTIVE: 1,     // 进行中
  FINISHED: 2,   // 已结束
  CANCELLED: 3   // 已取消
}

// 抽奖类型
export const LOTTERY_TYPE = {
  RANDOM: 'random',       // 随机抽奖
  LUCKY_DRAW: 'lucky'     // 转盘抽奖
}
