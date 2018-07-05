//index.js
//获取应用实例
const app = getApp()
const path = '/praise/pages/praise/'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: path,
    })
  },
  onLoad: function() {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // wx.navigateTo({
    //   url: path,
    // })
    // return
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.navigateTo({
        url: path,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.navigateTo({
          url: path,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.navigateTo({
            url: path,
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.navigateTo({
      url: path,
    })
  },
  handletouchstart: function (event) {
    this.refreshView.handletouchstart(event)
  },
  handletouchmove: function (event) {
    this.refreshView.handletouchmove(event)
  },
  handletouchend: function (event) {
    this.refreshView.handletouchend(event)
  },
  handletouchcancel: function (event) {
    this.refreshView.handletouchcancel(event)
  },
  onPageScroll: function (event) {
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh:function(){
    setTimeout(() => { this.refreshView.stopPullRefresh()},5000)
  }
})