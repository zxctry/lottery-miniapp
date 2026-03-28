<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { initCloud } from './utils/cloud'

onLaunch(() => {
  console.log('App Launch')
  // 初始化云开发
  initCloud()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

/* 全局滚动条隐藏 */
::-webkit-scrollbar {
  display: none;
}
</style>
