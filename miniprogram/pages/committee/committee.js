// committee.js
const app = getApp()

Page({
  data: {
    searchText: '',
    committees: [
      {
        id: 1,
        name: '管理咨询委员会',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: '为企业和政府提供管理咨询服务，优化组织结构和运营流程'
      },
      {
        id: 2,
        name: '汽车产业与技术专委会',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: '专注汽车产业发展趋势，推动新能源汽车和智能驾驶技术创新'
      },
      {
        id: 3,
        name: '人工智能专委会',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: '推动人工智能技术研发与应用，促进AI产业化发展'
      },
      {
        id: 4,
        name: '智能装备专委会',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '致力于智能制造装备技术创新，助力制造业数字化转型'
      },
      {
        id: 5,
        name: '智能交通专委会',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '发展智慧交通系统，构建安全高效的交通运输体系'
      },
      {
        id: 6,
        name: '新材料专委会',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: '研发先进材料技术，推动新材料产业创新发展'
      },
      {
        id: 7,
        name: '智慧农业专委会',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: '运用现代科技发展智慧农业，提升农业生产效率和质量'
      },
      {
        id: 8,
        name: '投融资专委会',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: '为创新项目提供投融资服务，助力科技成果产业化'
      },
      {
        id: 9,
        name: '低碳经济专委会',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '推进绿色低碳发展，助力实现碳达峰碳中和目标'
      },
      {
        id: 10,
        name: '清洁能源专委会',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: '发展可再生能源技术，推动能源结构优化升级'
      },
      {
        id: 11,
        name: '生物医药专委会',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '促进生物医药技术创新，推动健康产业发展'
      },
      {
        id: 12,
        name: '经济法制专委会',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: '完善经济法制体系，为经济发展提供法律保障'
      }
    ]
  },

  onLoad: function (options) {
    console.log('专委会页面加载')
    this.loadCommitteeData()
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  // 搜索输入处理
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
    this.filterCommittees(e.detail.value)
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: ''
    })
    this.filterCommittees('')
  },

  // 过滤专委会
  filterCommittees: function(searchText) {
    if (!searchText.trim()) {
      // 显示所有专委会
      this.loadCommitteeData()
      return
    }

    const allCommittees = [
      {
        id: 1,
        name: '管理咨询委员会',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: '为企业和政府提供管理咨询服务，优化组织结构和运营流程'
      },
      {
        id: 2,
        name: '汽车产业与技术专委会',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: '专注汽车产业发展趋势，推动新能源汽车和智能驾驶技术创新'
      },
      {
        id: 3,
        name: '人工智能专委会',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: '推动人工智能技术研发与应用，促进AI产业化发展'
      },
      {
        id: 4,
        name: '智能装备专委会',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '致力于智能制造装备技术创新，助力制造业数字化转型'
      },
      {
        id: 5,
        name: '智能交通专委会',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '发展智慧交通系统，构建安全高效的交通运输体系'
      },
      {
        id: 6,
        name: '新材料专委会',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: '研发先进材料技术，推动新材料产业创新发展'
      },
      {
        id: 7,
        name: '智慧农业专委会',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: '运用现代科技发展智慧农业，提升农业生产效率和质量'
      },
      {
        id: 8,
        name: '投融资专委会',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: '为创新项目提供投融资服务，助力科技成果产业化'
      },
      {
        id: 9,
        name: '低碳经济专委会',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '推进绿色低碳发展，助力实现碳达峰碳中和目标'
      },
      {
        id: 10,
        name: '清洁能源专委会',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        description: '发展可再生能源技术，推动能源结构优化升级'
      },
      {
        id: 11,
        name: '生物医药专委会',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '促进生物医药技术创新，推动健康产业发展'
      },
      {
        id: 12,
        name: '经济法制专委会',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: '完善经济法制体系，为经济发展提供法律保障'
      }
    ]

    const filteredCommittees = allCommittees.filter(committee => 
      committee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      committee.description.toLowerCase().includes(searchText.toLowerCase())
    )

    this.setData({
      committees: filteredCommittees
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
    this.filterCommittees(searchText)
  },

  // 加载专委会数据
  loadCommitteeData: function() {
    // 从云数据库加载专委会数据
    const db = app.getDB()
    if (db) {
      db.collection('committees').orderBy('id', 'asc').get()
        .then(res => {
          if (res.data && res.data.length > 0) {
            console.log('从云数据库加载专委会数据成功')
            this.setData({
              committees: res.data
            })
          } else {
            console.log('使用默认专委会数据')
          }
        })
        .catch(err => {
          console.log('加载专委会数据失败，使用默认数据:', err)
        })
    }
  },

  // 专委会卡片点击
  onCommitteeCardTap: function(e) {
    const committeeId = e.currentTarget.dataset.id
    const committee = this.data.committees.find(item => item.id === committeeId)
    
    if (committee) {
      wx.showModal({
        title: committee.name,
        content: committee.description + '\n\n联系我们获取更多信息和服务支持。',
        showCancel: true,
        cancelText: '关闭',
        confirmText: '联系我们',
        success: (res) => {
          if (res.confirm) {
            wx.showModal({
              title: '联系方式',
              content: '获取更多详细资料，请联系：\n\n微信：chenchenchen_000\n\n电话：18917686962',
              showCancel: false,
              confirmText: '我知道了'
            })
          }
        }
      })
    }
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 专委会',
      path: '/pages/committee/committee',
      imageUrl: '/images/share-committee.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadCommitteeData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success'
      })
    }, 1500)
  }
})
