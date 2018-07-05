// components/RefreshLayout/refresh-layout.js
let lastY = 0
const PULL_DEFAULT = -1 //默认
const PULL_LT_HEIGHT = 1 //下拉小于高度
const PULL_GT_HEIGHT = 2 //下拉大于高度
const PULL_REFRESHING = 0 //刷新中
let platform = 'ios', scale = 375/ wx.getSystemInfoSync().windowWidth*2
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backgroundColor: {
      type: String,
      value: "#000"
    },
    refreshHeight: {
      type: Number,
      value: 150
    },
    textColor: {
      type: String,
      value: "white"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullState: PULL_DEFAULT, // 刷新状态 -1:默认  1:开始下拉  2: 达到下拉最大距离  0: 正在刷新 
    dynamicHeight: 0, //刷新布局动态高度
    refreshHeight: 150, //触发刷新的最小高度
    scrollTop: 0
  },
  /***
   * 不能使用setData
   */
  created: function() {
    platform = wx.getSystemInfoSync().platform
    scale =  wx.getSystemInfoSync().windowWidth / 375 *2
  },
  attached: function() {},
  ready: function() {},
  moved: function() {},
  detached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    //自动刷新
    autoRefresh() {
      this._pullStateChange(PULL_REFRESHING, this.data.refreshHeight)
      //刷新事件 回调出去
      this.triggerEvent("onRefresh")
    },
    //停止刷新
    stopPullRefresh() {
      // this._pullStateChange(PULL_DEFAULT, 0)
      this.setData({
        pullState: PULL_DEFAULT,
        dynamicHeight: 0
      }, () => {
        wx.pageScrollTo({scrollTop: 0,duration: 0})
      })

    },
    //是否正在刷新
    isRefreshing() {
      return PULL_REFRESHING == this.data.pullState
    },
    //是否下拉状态
    isPullState() {
      return PULL_DEFAULT != this.data.pullState
    },
    //页面触摸开始事件，必须在触摸开始方法中调用此方法
    handletouchstart: function(event) {
      lastY = event.touches[0].clientY
    },
    //页面触摸移动事件，必须在触摸开始方法中调用此方法
    handletouchmove: function(event) {
      let pageY = event.touches[0].pageY
      let clientY = event.touches[0].clientY
      let offsetY = clientY - lastY
      if (this.data.scrollTop > 0 || offsetY < 0) return
      // if (0 == this.data.pullState) return
      let dynamicHeight = this.data.dynamicHeight + offsetY
      if (dynamicHeight > this.data.refreshHeight) {
        this._pullStateChange( (0 == this.data.pullState)?0:PULL_GT_HEIGHT, dynamicHeight)
      } else {
        dynamicHeight = dynamicHeight < 0 ? 0 : dynamicHeight //如果动态高度小于0处理
        this._pullStateChange((0 == this.data.pullState) ? 0 :PULL_LT_HEIGHT, dynamicHeight)
      }
      lastY = event.touches[0].clientY
    },
    //页面触摸结束事件，必须在触摸开始方法中调用此方法
    handletouchend: function(event) {
      let refreshHeight = this.data.refreshHeight
      if (0 == this.data.pullState){ 
        this._pullStateChange(PULL_REFRESHING, refreshHeight)
        return
      }
      let dynamicHeight = this.data.dynamicHeight
      if (this.data.scrollTop > 0 && PULL_DEFAULT != this.data.pullState) {
        // let top = this.data.scrollTop / wx.getSystemInfoSync().windowWidth * 20
        //2 * this.data.scrollTop 两倍表示px转rpx，  所以这里必须进行单位转换
        if (dynamicHeight - scale * this.data.scrollTop > refreshHeight) {
          this._pullStateChange(PULL_REFRESHING, refreshHeight)
          //刷新事件 回调出去
          this.triggerEvent("onRefresh")
        } else {
          this._pullStateChange(PULL_DEFAULT, 0)
          wx.pageScrollTo({scrollTop: 0,duration: 0})
        }
        return
      }
      if (dynamicHeight >= this.data.refreshHeight) {
        this._pullStateChange(PULL_REFRESHING, refreshHeight)
        //刷新事件 回调出去
        this.triggerEvent("onRefresh")
      } else {
        this._pullStateChange(PULL_DEFAULT, 0)
      }
    },
    //页面触摸取消事件，必须在触摸开始方法中调用此方法
    handletouchcancel: function(event) {
      this._pullStateChange(PULL_DEFAULT, 0)
    },
    //页面滚动
    onPageScroll: function(event) {
      if (event.scrollTop > 0 && PULL_DEFAULT != this.data.pullState) {
        //2 * this.data.scrollTop 两倍表示px转rpx，  所以这里必须进行单位转换
        if (this.data.dynamicHeight - scale * event.scrollTop < this.data.refreshHeight) {
          this.setData({
            pullState: PULL_LT_HEIGHT
          })
        } else {
          this.setData({
            pullState: PULL_GT_HEIGHT
          })
        }
      }
      this.data.scrollTop = event.scrollTop
    },
    //是否是安卓平台
    _isAndriod() {
      return 'ios' == platform
    },
    //下拉状态监听
    _pullStateChange(state, dynamicHeight) {
      this.setData({pullState: state,dynamicHeight: dynamicHeight})
      this.triggerEvent("onPullState")
    }
  }
})