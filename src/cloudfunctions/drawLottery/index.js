// 云函数：执行抽奖开奖
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { lotteryId } = event
  const wxContext = cloud.getWXContext()

  try {
    // 获取抽奖活动
    const lotteryRes = await db.collection('lotteries').doc(lotteryId).get()
    const lottery = lotteryRes.data

    if (!lottery) {
      return { success: false, message: '活动不存在' }
    }

    if (lottery.creatorId !== wxContext.OPENID) {
      return { success: false, message: '只有创建者可以开奖' }
    }

    if (lottery.status !== 1) {
      return { success: false, message: '活动不在进行中' }
    }

    // 获取所有参与者
    const participantsRes = await db.collection('participants')
      .where({ lotteryId })
      .get()
    const participants = participantsRes.data

    if (participants.length === 0) {
      return { success: false, message: '暂无参与者' }
    }

    // 随机抽取中奖者
    const shuffled = participants.sort(() => Math.random() - 0.5)
    let pickIndex = 0
    const winners = []

    for (const prize of lottery.prizes) {
      for (let i = 0; i < prize.count && pickIndex < shuffled.length; i++) {
        winners.push({
          prize: prize.name,
          userId: shuffled[pickIndex].userId,
          userName: shuffled[pickIndex].nickName,
          avatarUrl: shuffled[pickIndex].avatarUrl,
        })
        pickIndex++
      }
    }

    // 更新活动状态
    await db.collection('lotteries').doc(lotteryId).update({
      data: {
        status: 2,
        winners,
        drawTime: db.serverDate(),
      }
    })

    return { success: true, winners }
  } catch (err) {
    return { success: false, message: err.message }
  }
}
