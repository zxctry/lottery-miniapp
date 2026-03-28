<template>
  <view class="container">
    <!-- 活动信息 -->
    <view class="header-card">
      <view class="status-tag" :class="getStatusClass(lottery.status)">
        {{ getStatusText(lottery.status) }}
      </view>
      <text class="lottery-title">{{ lottery.title }}</text>
      <text class="lottery-desc">{{ lottery.description }}</text>
      <view class="lottery-meta">
        <text class="meta-item">📅 截止：{{ formatEndTime }}</text>
        <text class="meta-item">👥 {{ lottery.participantCount }}人参与</text>
      </view>
    </view>

    <!-- 奖品列表 -->
    <view class="section">
      <text class="section-title">🎁 奖品列表</text>
      <view class="prize-list">
        <view v-for="(prize, idx) in lottery.prizes" :key="idx" class="prize-card">
          <view class="prize-rank">{{ getRankLabel(idx) }}</view>
          <view class="prize-info">
            <text class="prize-name">{{ prize.name }}</text>
            <text class="prize-count">共 {{ prize.count }} 份</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 参与者头像 -->
    <view v-if="lottery.participants.length > 0" class="section">
      <text class="section-title">👥 参与者 ({{ lottery.participantCount }})</text>
      <view class="avatar-list">
        <view v-for="(p, idx) in lottery.participants.slice(0, 20)" :key="idx" class="avatar-item">
          <view class="avatar">
            <text class="avatar-text">{{ getAvatarText(idx) }}</text>
          </view>
        </view>
        <view v-if="lottery.participantCount > 20" class="avatar-item">
          <view class="avatar more">
            <text class="avatar-text">+{{ lottery.participantCount - 20 }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 中奖结果 -->
    <view v-if="lottery.status === 2 && lottery.winners.length > 0" class="section">
      <text class="section-title">🏆 中奖名单</text>
      <view class="winner-list">
        <view v-for="(winner, idx) in lottery.winners" :key="idx" class="winner-card">
          <view class="winner-avatar">
            <text class="avatar-text">{{ winner.userName?.charAt(0) || '?' }}</text>
          </view>
          <view class="winner-info">
            <text class="winner-name">{{ winner.userName }}</text>
            <text class="winner-prize">{{ winner.prize }}</text>
          </view>
          <view class="winner-badge">🎉</view>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <!-- 未参与且进行中 -->
      <view
        v-if="lottery.status === 1 && !hasJoined"
        class="action-btn primary"
        @tap="joinLottery"
      >
        <text class="action-text">参与抽奖</text>
      </view>

      <!-- 已参与且进行中 -->
      <view v-if="lottery.status === 1 && hasJoined" class="action-btn joined">
        <text class="action-text">✅ 已参与</text>
      </view>

      <!-- 创建者且进行中 -> 开奖 -->
      <view
        v-if="lottery.status === 1 && isCreator"
        class="action-btn draw"
        @tap="drawLottery"
      >
        <text class="action-text">🎰 立即开奖</text>
      </view>

      <!-- 已结束 -> 查看结果 -->
      <view
        v-if="lottery.status === 2"
        class="action-btn result"
        @tap="goResult"
      >
        <text class="action-text">查看抽奖结果</text>
      </view>

      <!-- 分享 -->
      <view class="action-btn share" @tap="shareLottery">
        <text class="action-text share-text">📤 分享给好友</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { mockDB } from '@/utils/mock'
import { formatTime, showToast, showLoading, hideLoading } from '@/utils/common'
import { LOTTERY_STATUS } from '@/utils/config'

const lotteryId = ref('')
const currentUserId = ref('u1') // Mock 当前用户
const lottery = ref<any>({
  title: '',
  description: '',
  prizes: [],
  participants: [],
  winners: [],
  participantCount: 0,
  status: 0,
  endTime: '',
  creatorId: '',
})

onLoad((options: any) => {
  lotteryId.value = options.id
  loadDetail()
})

const loadDetail = () => {
  const detail = mockDB.getLotteryDetail(lotteryId.value)
  if (detail) {
    lottery.value = detail
  }
}

const hasJoined = computed(() => {
  return lottery.value.participants.includes(currentUserId.value)
})

const isCreator = computed(() => {
  return lottery.value.creatorId === currentUserId.value
})

const formatEndTime = computed(() => {
  if (!lottery.value.endTime) return ''
  return formatTime(lottery.value.endTime)
})

const getRankLabel = (idx: number) => {
  const labels = ['🥇', '🥈', '🥉']
  return labels[idx] || `${idx + 1}`
}

const getAvatarText = (idx: number) => {
  const names = ['明', '红', '刚', '丽', '强', '芳', '伟', '雪', '杰', '燕', '磊', '静', '涛', '敏', '军', '艳', '勇', '娟', '斌', '玲']
  return names[idx % names.length]
}

const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    [LOTTERY_STATUS.PENDING]: '未开始',
    [LOTTERY_STATUS.ACTIVE]: '进行中',
    [LOTTERY_STATUS.FINISHED]: '已结束',
    [LOTTERY_STATUS.CANCELLED]: '已取消',
  }
  return map[status] || '未知'
}

const getStatusClass = (status: number) => {
  const map: Record<number, string> = {
    [LOTTERY_STATUS.PENDING]: 'pending',
    [LOTTERY_STATUS.ACTIVE]: 'active',
    [LOTTERY_STATUS.FINISHED]: 'finished',
    [LOTTERY_STATUS.CANCELLED]: 'cancelled',
  }
  return map[status] || ''
}

const joinLottery = () => {
  showLoading('参与中...')
  setTimeout(() => {
    const success = mockDB.joinLottery(lotteryId.value, currentUserId.value)
    hideLoading()
    if (success) {
      showToast('参与成功！', 'success')
      loadDetail()
    } else {
      showToast('你已经参与过了')
    }
  }, 500)
}

const drawLottery = () => {
  uni.showModal({
    title: '确认开奖',
    content: `当前有 ${lottery.value.participantCount} 人参与，确定要立即开奖吗？`,
    success: (res) => {
      if (res.confirm) {
        showLoading('开奖中...')
        setTimeout(() => {
          const winners = mockDB.drawLottery(lotteryId.value)
          hideLoading()
          if (winners) {
            showToast('开奖成功！', 'success')
            loadDetail()
          }
        }, 1500)
      }
    }
  })
}

const goResult = () => {
  uni.navigateTo({ url: `/pages/result/result?id=${lotteryId.value}` })
}

const shareLottery = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 160px;
}

.header-card {
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  margin: 12px 16px;
  border-radius: 16px;
  padding: 24px 20px;
  color: #fff;
}

.status-tag {
  display: inline-block;
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.lottery-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
  display: block;
}

.lottery-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 16px;
  display: block;
}

.lottery-meta {
  display: flex;
  gap: 20px;
}

.meta-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 14px;
  display: block;
}

.prize-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prize-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #FFF8F0;
  border-radius: 10px;
  padding: 14px;
}

.prize-rank {
  font-size: 24px;
  width: 40px;
  text-align: center;
}

.prize-info {
  flex: 1;
}

.prize-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: block;
}

.prize-count {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  display: block;
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.avatar-item {
  width: 40px;
  height: 40px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar.more {
  background: #eee;
}

.avatar-text {
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.avatar.more .avatar-text {
  color: #999;
  font-size: 12px;
}

.winner-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.winner-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F0FFF4;
  border: 1px solid #C6F6D5;
  border-radius: 10px;
  padding: 14px;
}

.winner-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.winner-avatar .avatar-text {
  font-size: 16px;
}

.winner-info {
  flex: 1;
}

.winner-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: block;
}

.winner-prize {
  font-size: 13px;
  color: #27AE60;
  margin-top: 2px;
  display: block;
}

.winner-badge {
  font-size: 24px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.primary {
  background: linear-gradient(135deg, #E54D42, #F37B1D);
}

.action-btn.joined {
  background: #f0f0f0;
}

.action-btn.draw {
  background: linear-gradient(135deg, #F37B1D, #FDCB6E);
}

.action-btn.result {
  background: linear-gradient(135deg, #27AE60, #2ECC71);
}

.action-btn.share {
  flex: 0 0 auto;
  width: 48px;
  background: #f0f0f0;
  border-radius: 24px;
}

.action-text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.action-btn.joined .action-text {
  color: #999;
}

.share-text {
  font-size: 18px;
}
</style>
