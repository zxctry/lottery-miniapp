<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="profile-header">
      <view class="avatar-wrap">
        <view class="avatar">
          <text class="avatar-text">{{ userInfo.nickName?.charAt(0) || '?' }}</text>
        </view>
      </view>
      <text class="user-name">{{ userInfo.nickName || '未登录' }}</text>
      <view v-if="!userInfo.nickName" class="login-btn" @tap="login">
        <text class="login-text">点击登录</text>
      </view>
    </view>

    <!-- 统计 -->
    <view class="stats-card">
      <view class="stat-item" @tap="goMy">
        <text class="stat-value">{{ myStats.created }}</text>
        <text class="stat-label">创建抽奖</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ myStats.joined }}</text>
        <text class="stat-label">参与抽奖</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ myStats.won }}</text>
        <text class="stat-label">中奖次数</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goMy">
        <text class="menu-icon">📋</text>
        <text class="menu-text">我的抽奖</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="goCreate">
        <text class="menu-icon">➕</text>
        <text class="menu-text">创建抽奖</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 版本 -->
    <view class="version">
      <text class="version-text">抽奖助手 v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getLocalUser, setLocalUser } from '@/utils/common'
import { mockDB } from '@/utils/mock'

const userInfo = ref<any>(getLocalUser() || {})

const myStats = ref({
  created: mockDB.getMyLotteries('u1').length,
  joined: mockDB.getJoinedLotteries('u1').length,
  won: 2,
})

const login = () => {
  // Mock 登录
  userInfo.value = {
    nickName: '测试用户',
    avatarUrl: '',
  }
  setLocalUser(userInfo.value)
}

const goMy = () => {
  uni.switchTab({ url: '/pages/my/my' })
}

const goCreate = () => {
  uni.navigateTo({ url: '/pages/create/create' })
}

const showAbout = () => {
  uni.showModal({
    title: '关于抽奖助手',
    content: '抽奖助手是一款微信小程序，帮助用户快速创建抽奖活动，支持多奖品设置、随机开奖、结果分享等功能。',
    showCancel: false,
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-header {
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  padding: 48px 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrap {
  margin-bottom: 12px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 28px;
  color: #fff;
  font-weight: 700;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.login-btn {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 4px 16px;
}

.login-text {
  font-size: 13px;
  color: #fff;
}

.stats-card {
  margin: -20px 16px 12px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

.menu-section {
  margin: 12px 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.menu-arrow {
  font-size: 14px;
  color: #ccc;
}

.version {
  text-align: center;
  padding: 24px;
}

.version-text {
  font-size: 12px;
  color: #ccc;
}
</style>
