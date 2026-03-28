<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-inner">
        <text class="navbar-title">抽奖助手</text>
      </view>
    </view>

    <!-- Banner -->
    <view class="banner" :style="{ marginTop: (statusBarHeight + 44) + 'px' }">
      <view class="banner-content">
        <text class="banner-title">🎉 抽奖助手</text>
        <text class="banner-desc">创建抽奖活动，一键开奖，公平公正</text>
        <view class="banner-btn" @tap="goCreate">
          <text class="banner-btn-text">+ 创建抽奖</text>
        </view>
      </view>
    </view>

    <!-- Tab 切换 -->
    <view class="tabs">
      <view
        v-for="(tab, idx) in tabs"
        :key="idx"
        class="tab-item"
        :class="{ active: currentTab === idx }"
        @tap="switchTab(idx)"
      >
        <text class="tab-text">{{ tab }}</text>
        <view v-if="currentTab === idx" class="tab-line"></view>
      </view>
    </view>

    <!-- 抽奖列表 -->
    <view class="lottery-list">
      <view
        v-for="item in filteredList"
        :key="item._id"
        class="lottery-card"
        @tap="goDetail(item._id)"
      >
        <view class="card-header">
          <view class="status-tag" :class="getStatusClass(item.status)">
            {{ getStatusText(item.status) }}
          </view>
          <text class="card-time">{{ formatRelativeTime(item.createTime) }}</text>
        </view>
        <text class="card-title">{{ item.title }}</text>
        <text class="card-desc">{{ item.description }}</text>

        <!-- 奖品预览 -->
        <view class="prize-preview">
          <view v-for="(prize, pidx) in item.prizes.slice(0, 3)" :key="pidx" class="prize-tag">
            <text class="prize-tag-text">{{ prize.name }}</text>
          </view>
          <text v-if="item.prizes.length > 3" class="prize-more">+{{ item.prizes.length - 3 }}</text>
        </view>

        <!-- 底部信息 -->
        <view class="card-footer">
          <view class="card-info">
            <text class="info-text">👥 {{ item.participantCount }}人参与</text>
            <text class="info-text">🎁 {{ item.totalCount }}个奖品</text>
          </view>
          <text v-if="item.status === 2" class="result-hint">查看结果 ></text>
          <text v-else-if="item.status === 1" class="join-hint">去参与 ></text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredList.length === 0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无抽奖活动</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockDB } from '@/utils/mock'
import { formatRelativeTime } from '@/utils/common'
import { LOTTERY_STATUS } from '@/utils/config'

const statusBarHeight = ref(20)
const currentTab = ref(0)
const tabs = ['全部', '进行中', '已结束']
const lotteries = ref<any[]>([])

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
  loadData()
})

const loadData = () => {
  lotteries.value = mockDB.getLotteries()
}

const filteredList = computed(() => {
  if (currentTab.value === 0) return lotteries.value
  if (currentTab.value === 1) return lotteries.value.filter(l => l.status === LOTTERY_STATUS.ACTIVE)
  return lotteries.value.filter(l => l.status === LOTTERY_STATUS.FINISHED)
})

const switchTab = (idx: number) => {
  currentTab.value = idx
}

const goCreate = () => {
  uni.navigateTo({ url: '/pages/create/create' })
}

const goDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
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
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #E54D42, #F37B1D);
}

.navbar-inner {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.banner {
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  padding: 24px 20px 32px;
  border-radius: 0 0 24px 24px;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.banner-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20px;
}

.banner-btn {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 10px 32px;
}

.banner-btn-text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 50;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  position: relative;
}

.tab-text {
  font-size: 15px;
  color: #666;
}

.tab-item.active .tab-text {
  color: #E54D42;
  font-weight: 600;
}

.tab-line {
  position: absolute;
  bottom: 0;
  width: 24px;
  height: 3px;
  background: #E54D42;
  border-radius: 2px;
}

.lottery-list {
  padding: 12px 16px;
}

.lottery-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
}

.status-tag.active {
  background: rgba(229, 77, 66, 0.1);
  color: #E54D42;
}

.status-tag.pending {
  background: rgba(243, 123, 29, 0.1);
  color: #F37B1D;
}

.status-tag.finished {
  background: rgba(39, 174, 96, 0.1);
  color: #27AE60;
}

.status-tag.cancelled {
  background: rgba(153, 153, 153, 0.1);
  color: #999;
}

.card-time {
  font-size: 12px;
  color: #bbb;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
  display: block;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prize-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.prize-tag {
  background: #FFF8F0;
  border: 1px solid #FFE4CC;
  border-radius: 6px;
  padding: 4px 10px;
}

.prize-tag-text {
  font-size: 12px;
  color: #F37B1D;
}

.prize-more {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.card-info {
  display: flex;
  gap: 16px;
}

.info-text {
  font-size: 12px;
  color: #bbb;
}

.result-hint {
  font-size: 13px;
  color: #27AE60;
  font-weight: 600;
}

.join-hint {
  font-size: 13px;
  color: #E54D42;
  font-weight: 600;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #bbb;
}
</style>
