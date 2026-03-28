<template>
  <view class="container">
    <!-- Tab -->
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

    <!-- 列表 -->
    <view class="lottery-list">
      <view
        v-for="item in currentList"
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
        <view class="card-footer">
          <text class="card-info">👥 {{ item.participantCount }}人参与</text>
          <text v-if="item.status === 2" class="card-result">已开奖</text>
        </view>
      </view>

      <view v-if="currentList.length === 0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">{{ currentTab === 0 ? '你还没有创建过抽奖' : '你还没有参与过抽奖' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockDB } from '@/utils/mock'
import { formatRelativeTime } from '@/utils/common'
import { LOTTERY_STATUS } from '@/utils/config'

const currentUserId = ref('u1')
const currentTab = ref(0)
const tabs = ['我创建的', '我参与的']

const createdList = ref(mockDB.getMyLotteries(currentUserId.value))
const joinedList = ref(mockDB.getJoinedLotteries(currentUserId.value))

const currentList = computed(() => {
  return currentTab.value === 0 ? createdList.value : joinedList.value
})

const switchTab = (idx: number) => {
  currentTab.value = idx
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

.tabs {
  display: flex;
  background: #fff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  position: relative;
}

.tab-text {
  font-size: 15px;
  color: #999;
  font-weight: 500;
}

.tab-item.active .tab-text {
  color: #333;
  font-weight: 700;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
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
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 600;
}

.status-tag.pending {
  background: rgba(52, 152, 219, 0.1);
  color: #3498DB;
}

.status-tag.active {
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
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.card-info {
  font-size: 13px;
  color: #999;
}

.card-result {
  font-size: 13px;
  color: #27AE60;
  font-weight: 600;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
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
