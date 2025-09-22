// main.js
const app = getApp()

Page({
  data: {
    searchText: '',
    activities: [
      {
        id: 1,
        title: '法治赋能未来产业研讨会成功举办',
        image: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250911165056_445_62.jpg?sign=516786a8e3572303b8c8cf75627175e3&t=1758214930',
        date: '2025-09-15',
        location: '上海华夏君和律师事务所',
        description: '2025年9月11日下午，由同心济世博士联盟主办，上海华夏汇鸿律师事务所、上海市君和律师事务所共同承办的“法治赋能未来产业研讨会”在上海新金桥广场成功举行。本次会议旨在探讨在人工智能引领的产业升级背景下，法治与法律职业如何为新兴产业提供系统性支持与赋能。研讨会由同心济世博士联盟副会长兼秘书长何忠成主持'
      },
      {
        id: 2,
        title: '访问同济南昌智能新能源汽车研究院',
        image: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250920161051_21_90.jpg?sign=5052d124fd7540eae27f420715e34fdf&t=1758356121',
        date: '2025-09-20',
        location: '同济南昌汽车研究院',
        description: '拜访同济南昌汽车研究院，和来自研究院的领导和专家齐聚一堂，就前沿学术问题和发展趋势进行深入探讨和交流。'
      }
    ]
  },

  onLoad: function (options) {
    // 页面加载完成
    this.loadActivities()
  },

  // 图片加载成功
  onImageLoad: function(e) {
    console.log('图片加载成功:', e.detail)
  },

  // 图片加载失败
  onImageError: function(e) {
    console.log('图片加载失败:', e.detail)
    // 可以设置默认图片
    const index = e.currentTarget.dataset.index
    if (index !== undefined) {
      const key = `activities[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    }
  },

  onShow: function () {
    // 页面显示时更新数据
  },

  // 搜索输入处理
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: ''
    })
  },

  // 执行搜索
  performSearch: function() {
    const { searchText } = this.data
    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '搜索中...'
    })

    // 这里可以调用搜索API
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `搜索"${searchText}"`,
        icon: 'none'
      })
    }, 1000)
  },

  // 功能卡片导航
  navigateToPage: function(e) {
    const page = e.currentTarget.dataset.page
    
    // 专委会页面直接跳转
    if (page === 'committee') {
      wx.navigateTo({
        url: '/pages/committee/committee'
      })
      return
    }
    
    // 转化中心页面直接跳转
    if (page === 'transform') {
      wx.navigateTo({
        url: '/pages/transform/transform'
      })
      return
    }
    
    const pageMap = {
      'secretary': {
        title: '秘书处',
        desc: '负责联盟日常事务管理和协调工作'
      },
      'academy': {
        title: '求是书院',
        desc: '人才培养和学术交流平台'
      }
    }

    const pageInfo = pageMap[page]
    if (pageInfo) {
      wx.showModal({
        title: pageInfo.title,
        content: pageInfo.desc,
        showCancel: false,
        confirmText: '我知道了'
      })
    }
  },

  // 加载活动数据
  loadActivities: function() {
    wx.showLoading({
      title: '加载活动数据...'
    })

    // 从云数据库加载活动数据
    const db = app.getDB()
    if (db) {
      // 尝试从云数据库获取活动数据
      db.collection('activities').orderBy('createTime', 'desc').limit(10).get()
        .then(res => {
          wx.hideLoading()
          if (res.data && res.data.length > 0) {
            // 使用云数据库的数据
            this.setData({
              activities: res.data
            })
            console.log('从云数据库加载活动数据成功:', res.data.length + '条')
          } else {
            console.log('云数据库中暂无活动数据，使用默认数据')
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('加载云数据库活动数据失败，使用默认数据:', err)
          // 失败时使用默认数据
        })
    } else {
      wx.hideLoading()
      console.log('云数据库未初始化，使用默认数据')
    }
  },

  // 查看更多活动
  viewMoreActivities: function() {
    wx.showModal({
      title: '更多活动',
      content: '即将为您展示更多精彩活动，敬请期待！',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 查看活动详情
  viewActivityDetail: function(e) {
    const activityId = e.currentTarget.dataset.id
    const activity = this.data.activities.find(item => item.id == activityId)
    
    if (activity) {
      wx.showModal({
        title: activity.title,
        content: `时间：${activity.date}\n地点：${activity.location}\n\n${activity.description}`,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '我要报名',
        success: (res) => {
          if (res.confirm) {
            this.registerActivity(activityId)
          }
        }
      })
    }
  },

  // 报名活动
  registerActivity: function(activityId) {
    wx.showLoading({
      title: '报名中...'
    })

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '报名成功',
        content: '您已成功报名此活动，我们将通过短信或邮件通知您相关信息。',
        showCancel: false,
        confirmText: '确定'
      })
    }, 1500)
  },

  // 查看人才培养方案
  viewTalentProgram: function() {
    wx.showModal({
      title: '人才培养方案',
      content: '博士联盟致力于为成员提供全方位的人才培养计划，包括学术指导、职业发展、创新创业等多个方面的支持。\n\n主要内容：\n• 学术研究指导\n• 职业规划咨询\n• 创新项目孵化\n• 国际交流机会\n• 产学研合作',
      showCancel: true,
      cancelText: '关闭',
      confirmText: '了解更多',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '获取更多详细资料，请联系：\n\n微信：chenchenchen_000\n\n电话：18017851320',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 底部导航 - 首页
  navigateToHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  // 底部导航 - 联盟介绍
  navigateToAlliance: function() {
    wx.navigateTo({
      url: '/pages/alliance/alliance'
    })
  },

  // 底部导航 - 活动详情
  navigateToActivities: function() {
    wx.showModal({
      title: '活动详情',
      content: '活动详情页面正在开发中，敬请期待！',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 联盟介绍',
      path: '/pages/main/main',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadActivities()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success',
        duration: 1000
      })
    }, 1500)
  },

  // 触底加载更多
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多...'
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '暂无更多内容',
        icon: 'none'
      })
    }, 1000)
  }
})
