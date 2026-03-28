/**
 * 用户相关工具函数
 */

// 获取用户信息
export const getUserProfile = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve(res.userInfo)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取本地存储的用户信息
export const getLocalUser = () => {
  try {
    return uni.getStorageSync('userInfo')
  } catch {
    return null
  }
}

// 保存用户信息到本地
export const setLocalUser = (userInfo: any) => {
  try {
    uni.setStorageSync('userInfo', userInfo)
  } catch {
    // ignore
  }
}

// 获取 OpenID（云开发环境）
export const getOpenId = async () => {
  if (typeof wx !== 'undefined' && wx.cloud) {
    const res = await wx.cloud.callFunction({ name: 'login' })
    return res.result.openid
  }
  return 'mock_openid_' + Date.now()
}

// 格式化时间
export const formatTime = (date: Date | string | number): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 格式化相对时间
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = Date.now()
  const target = new Date(date).getTime()
  const diff = now - target

  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  return formatTime(date)
}

// 生成随机ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// 随机抽取N个人
export const randomPick = (arr: any[], count: number): any[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 显示提示
export const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none') => {
  uni.showToast({ title, icon, duration: 2000 })
}

// 显示加载
export const showLoading = (title: string = '加载中...') => {
  uni.showLoading({ title, mask: true })
}

// 隐藏加载
export const hideLoading = () => {
  uni.hideLoading()
}
