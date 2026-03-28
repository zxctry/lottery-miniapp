<template>
  <view class="container">
    <!-- 表单 -->
    <view class="form-section">
      <view class="form-group">
        <text class="form-label">活动标题 *</text>
        <input
          v-model="form.title"
          class="form-input"
          placeholder="例如：新年抽奖活动"
          maxlength="30"
        />
        <text class="char-count">{{ form.title.length }}/30</text>
      </view>

      <view class="form-group">
        <text class="form-label">活动描述</text>
        <textarea
          v-model="form.description"
          class="form-textarea"
          placeholder="简单描述一下这个抽奖活动"
          maxlength="200"
        />
        <text class="char-count">{{ form.description.length }}/200</text>
      </view>

      <!-- 奖品设置 -->
      <view class="form-group">
        <view class="group-header">
          <text class="form-label">奖品设置 *</text>
          <text class="add-btn" @tap="addPrize">+ 添加奖品</text>
        </view>

        <view v-for="(prize, idx) in form.prizes" :key="idx" class="prize-item">
          <view class="prize-row">
            <input
              v-model="prize.name"
              class="form-input prize-name"
              placeholder="奖品名称"
              maxlength="20"
            />
            <view class="prize-count-wrap">
              <text class="prize-count-label">数量</text>
              <input
                v-model.number="prize.count"
                class="form-input prize-count"
                type="number"
                placeholder="1"
              />
            </view>
            <view v-if="form.prizes.length > 1" class="remove-btn" @tap="removePrize(idx)">
              <text class="remove-icon">✕</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 截止时间 -->
      <view class="form-group">
        <text class="form-label">截止时间 *</text>
        <picker mode="date" :value="form.endDate" @change="onDateChange">
          <view class="picker-value">
            <text :class="{ placeholder: !form.endDate }">{{ form.endDate || '选择日期' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
        <picker mode="time" :value="form.endTime" @change="onTimeChange">
          <view class="picker-value">
            <text :class="{ placeholder: !form.endTime }">{{ form.endTime || '选择时间' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <!-- 参与限制 -->
      <view class="form-group">
        <text class="form-label">参与人数上限</text>
        <input
          v-model.number="form.joinLimit"
          class="form-input"
          type="number"
          placeholder="0 表示不限制"
        />
      </view>

      <!-- 是否公开 -->
      <view class="form-group">
        <view class="switch-row">
          <text class="form-label">公开活动</text>
          <switch :checked="form.isPublic" color="#E54D42" @change="form.isPublic = $event.detail.value" />
        </view>
        <text class="form-hint">公开后其他用户可以在首页看到此活动</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <view class="submit-btn" :class="{ disabled: !canSubmit }" @tap="submitForm">
        <text class="submit-text">创建抽奖活动</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockDB } from '@/utils/mock'
import { showToast, showLoading, hideLoading, formatTime } from '@/utils/common'
import { LOTTERY_STATUS } from '@/utils/config'

const form = ref({
  title: '',
  description: '',
  prizes: [
    { name: '', count: 1 },
  ],
  endDate: '',
  endTime: '',
  joinLimit: 0,
  isPublic: true,
})

const canSubmit = computed(() => {
  return (
    form.value.title.trim() &&
    form.value.prizes.every(p => p.name.trim() && p.count > 0) &&
    form.value.endDate &&
    form.value.endTime
  )
})

const addPrize = () => {
  if (form.value.prizes.length >= 10) {
    showToast('最多添加10个奖品')
    return
  }
  form.value.prizes.push({ name: '', count: 1 })
}

const removePrize = (idx: number) => {
  form.value.prizes.splice(idx, 1)
}

const onDateChange = (e: any) => {
  form.value.endDate = e.detail.value
}

const onTimeChange = (e: any) => {
  form.value.endTime = e.detail.value
}

const submitForm = () => {
  if (!canSubmit.value) {
    showToast('请填写完整信息')
    return
  }

  showLoading('创建中...')

  const totalCount = form.value.prizes.reduce((sum, p) => sum + p.count, 0)
  const endDateTime = `${form.value.endDate} ${form.value.endTime}`

  // 模拟创建
  setTimeout(() => {
    const lottery = mockDB.createLottery({
      title: form.value.title,
      description: form.value.description,
      prizes: form.value.prizes.map(p => ({ ...p, image: '' })),
      totalCount,
      status: LOTTERY_STATUS.ACTIVE,
      endTime: new Date(endDateTime).toISOString(),
      creatorId: 'u1',
      creatorName: '我',
      creatorAvatar: '',
      joinLimit: form.value.joinLimit || 0,
      isPublic: form.value.isPublic,
    })

    hideLoading()
    showToast('创建成功！', 'success')

    setTimeout(() => {
      uni.redirectTo({
        url: `/pages/detail/detail?id=${lottery._id}`
      })
    }, 500)
  }, 800)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
}

.form-section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 20px 16px;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.form-input {
  width: 100%;
  height: 44px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  color: #333;
}

.char-count {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  color: #bbb;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.group-header .form-label {
  margin-bottom: 0;
}

.add-btn {
  font-size: 14px;
  color: #E54D42;
  font-weight: 600;
}

.prize-item {
  margin-bottom: 10px;
}

.prize-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prize-name {
  flex: 1;
}

.prize-count-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.prize-count-label {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

.prize-count {
  width: 60px;
  text-align: center;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.remove-icon {
  font-size: 16px;
  color: #ccc;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0 14px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.picker-value .placeholder {
  color: #ccc;
}

.picker-arrow {
  color: #ccc;
  font-size: 14px;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-row .form-label {
  margin-bottom: 0;
}

.form-hint {
  font-size: 12px;
  color: #bbb;
  margin-top: 6px;
  display: block;
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
}

.submit-btn {
  height: 48px;
  background: linear-gradient(135deg, #E54D42, #F37B1D);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.disabled {
  opacity: 0.5;
}

.submit-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}
</style>
