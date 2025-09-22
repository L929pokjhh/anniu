// transform.js
const app = getApp()

Page({
  data: {
    searchText: '',
    latestNews: [
      {
        id: 1,
        title: '',
        image: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/Frame_192%402x.png?sign=ec2807cd0290e65e21899715fa4c77ff&t=1758360135',
        description: '为高校学生创业项目提供全方位支持和孵化服务',
        date: '2024-12-20'
      },
      {
        id: 2,
        title: '',
        image: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/Frame_193%403x.png?sign=ddec382254e8d3b10482df6a660ca34c&t=1758360153',
        description: '运用现代科技手段推动传统农业转型升级',
        date: '2024-12-18'
      }
    ],
    achievements: [
      {
        id: 1,
        title: '供应链工厂',
        image: '/images/default-goods-image.png',
        description: '围绕供应链工厂，深度挖掘供应链各环节数据价值，利用先进的数字化技术、智能化设备和管理系统，构建高效、透明、可追溯的供应链体系，实现供需精准匹配，降低运营成本，提升整体效率。',
        tags: ['数字化', '智能化', '供应链优化']
      },
      {
        id: 2,
        title: '科技成果转换',
        image: '/images/default-goods-image.png',
        description: '依托科技成果转化中心，实现 “双向驱动”——正向挖掘技术成果推动产业化落地，反向针对企业需求组织专家团队攻关。',
        tags: ['数字化', '智能化', '供应链优化']
      }
    ]
  },

  onLoad: function (options) {
    console.log('转化中心页面加载')
    this.loadTransformData()
  },

  onShow: function () {
    // 页面显示时的逻辑
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

    // 模拟搜索API调用
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `搜索"${searchText}"`,
        icon: 'none'
      })
    }, 1000)
  },

  // 加载转化中心数据
  loadTransformData: function() {
    wx.showLoading({
      title: '加载中...'
    })

    // 从云数据库加载转化中心数据
    const db = app.getDB()
    if (db) {
      // 加载最新消息
      const newsPromise = db.collection('transform_news').orderBy('date', 'desc').limit(10).get()
      // 加载成果展示
      const achievementsPromise = db.collection('transform_achievements').orderBy('createTime', 'desc').limit(10).get()
      
      Promise.all([newsPromise, achievementsPromise])
        .then(results => {
          wx.hideLoading()
          const [newsRes, achievementsRes] = results
          
          if (newsRes.data && newsRes.data.length > 0) {
            console.log('从云数据库加载最新消息成功')
            this.setData({
              latestNews: newsRes.data
            })
          }
          
          if (achievementsRes.data && achievementsRes.data.length > 0) {
            console.log('从云数据库加载成果数据成功')
            this.setData({
              achievements: achievementsRes.data
            })
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('加载转化中心数据失败，使用默认数据:', err)
        })
    } else {
      wx.hideLoading()
    }
  },

  // 最新消息卡片点击
  onNewsCardTap: function(e) {
    const newsId = e.currentTarget.dataset.id
    const news = this.data.latestNews.find(item => item.id === newsId)
    
    if (news) {
      wx.showModal({
        title: news.title,
        content: news.description + '\n\n发布时间：' + news.date,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '了解更多',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '更多详情即将推出',
              content: '获取更多详细资料，请联系：\n\n微信：chenchenchen_000\n\n电话：18917686962',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  // 成果展示卡片点击
  onAchievementCardTap: function(e) {
    const achievementId = e.currentTarget.dataset.id
    const achievement = this.data.achievements.find(item => item.id === achievementId)
    
    if (achievement) {
      wx.showModal({
        title: achievement.title,
        content: achievement.description,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '详细资料',
        success: (res) => {
          if (res.confirm) {
            wx.showModal({
              title: '联系我们',
              content: '获取更多详细资料，请联系：\n\n微信：chenchenchen_000\n\n电话：18917686962',
              showCancel: false
            })
          }
        }
      })
    }
  },

  // 查看更多信息
  viewMoreInfo: function() {
    wx.showModal({
      title: '历史成果展示',
      content: '转化中心致力于推动科技成果产业化，已成功孵化多个创新项目。更多历史成果信息正在整理中，敬请期待！',
      showCancel: true,
      cancelText: '关闭',
      confirmText: '订阅通知',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '订阅成功，我们将及时通知您',
            icon: 'success'
          })
        }
      }
    })
  },

  // 图片加载错误处理
  onImageError: function(e) {
    console.log('图片加载失败:', e.detail)
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    
    if (type === 'news' && index !== undefined) {
      const key = `latestNews[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    } else if (type === 'achievement' && index !== undefined) {
      const key = `achievements[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    }
  },

  // 图片预览
  //previewImage: function(e) {
  //  const url = e.currentTarget.dataset.url
  // if (url && !url.includes('default-goods-image.png')) {
  //  wx.previewImage({
  //  current: url,
  //     urls: [url]
  //   })
  //}
  //},

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 科学成果转化中心',
      path: '/pages/transform/transform',
      imageUrl: '/images/share-transform.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadTransformData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success'
      })
    }, 1500)
  },

  // 触底加载更多
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多...'
    })

    // 模拟加载更多数据
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '暂无更多内容',
        icon: 'none'
      })
    }, 1000)
  }
})
