<template>
  <view class="container">
    <!-- 结果头部 -->
    <view class="result-header">
      <text class="result-emoji">🎊</text>
      <text class="result-title">抽奖结果</text>
      <text class="result-subtitle">{{ lottery.title }}</text>
    </view>

    <!-- 中奖名单 -->
    <view class="winner-section">
      <text class="section-title">🏆 中奖名单</text>

      <view v-for="(prize, pidx) in lottery.prizes" :key="pidx" class="prize-group">
        <view class="prize-group-header">
          <text class="prize-group-rank">{{ getRankLabel(pidx) }}</text>
          <text class="prize-group-name">{{ prize.name }}</text>
          <text class="prize-group-count">{{ prize.count }}份</text>
        </view>

        <view class="winner-list">
          <view
            v-for="winner in getWinnersByPrize(prize.name)"
            :key="winner.userId"
            class="winner-item"
          >
            <view class="winner-avatar">
              <text class="avatar-text">{{ winner.userName?.charAt(0) || '?' }}</text>
            </view>
            <text class="winner-name">{{ maskName(winner.userName) }}</text>
          </view>
          <view v-if="getWinnersByPrize(prize.name).length === 0" class="no-winner">
            <text class="no-winner-text">暂无中奖者</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 统计 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ lottery.participantCount }}</text>
        <text class="stat-label">参与人数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ lottery.winners.length }}</text>
        <text class="stat-label">中奖人数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ lottery.totalCount }}</text>
        <text class="stat-label">奖品总数</text>
      </view>
    </view>

    <!-- 操作 -->
    <view class="actions">
      <view class="action-btn" @tap="shareResult">
        <text class="action-text">📤 分享结果</text>
      </view>
      <view class="action-btn secondary" @tap="goBack">
        <text class="action-text secondary-text">返回首页</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { mockDB } from '@/utils/mock'

const lotteryId = ref('')
const lottery = ref<any>({
  title: '',
  prizes: [],
  winners: [],
  participantCount: 0,
  totalCount: 0,
})

onLoad((options: any) => {
  lotteryId.value = options.id
  const detail = mockDB.getLotteryDetail(lotteryId.value)
  if (detail) {
    lottery.value = detail
  }
})

const getRankLabel = (idx: number) => {
  const labels = ['🥇', '🥈', '🥉']
  return labels[idx] || `${idx + 1}`
}

const getWinnersByPrize = (prizeName: string) => {
  return lottery.value.winners.filter((w: any) => w.prize === prizeName)
}

const maskName = (name: string) => {
  if (!name) return '***'
  if (name.length <= 2) return name.charAt(0) + '*'
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
}

const shareResult = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

const goBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.result-header {
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  padding: 40px 20px 32px;
  text-align: center;
}

.result-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.result-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  display: block;
  margin-bottom: 6px;
}

.result-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.winner-section {
  margin: -16px 16px 12px;
  background: #fff;
  border-radius: 16px;
  padding: 20px 16px;
  position: relative;
  z-index: 10;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  display: block;
}

.prize-group {
  margin-bottom: 20px;
}

.prize-group:last-child {
  margin-bottom: 0;
}

.prize-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.prize-group-rank {
  font-size: 20px;
}

.prize-group-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.prize-group-count {
  font-size: 13px;
  color: #999;
}

.winner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.winner-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF8F0;
  border-radius: 20px;
  padding: 6px 14px 6px 6px;
}

.winner-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.winner-avatar .avatar-text {
  font-size: 12px;
}

.winner-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.no-winner {
  padding: 10px 0;
}

.no-winner-text {
  font-size: 13px;
  color: #ccc;
}

.stats-section {
  margin: 12px 16px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #E54D42;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #eee;
}

.actions {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  height: 48px;
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.secondary {
  background: #fff;
  border: 1px solid #eee;
}

.action-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.secondary-text {
  color: #666;
}
</style>
