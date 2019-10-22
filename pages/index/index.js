//index.js
//获取应用实例
const app = getApp()
const Bmob = require('../../utils/Bmob-2.2.1.min.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    score:'',
    height:'',
    weight:'',
    tips:[
      {
        'title':'提示1',
        'url':'http://www.baidu.com'
      },
      {
        'title': '提示2',
        'url': 'http://www.bing.com'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    if (app.globalData.userId != ''){
      wx.navigateTo({
        url: '/pages/logs/logs'
      })
    }else{
      wx.showToast({
        title: '还未登录',
      })
      setTimeout(()=>{
        wx.hideToast();
        wx.navigateTo({
          url: '/pages/mine/mine',
        })
      },1500)
    }
  },
  setTips:function(){
    let tipsQuery = Bmob.Query("Tips")
    tipsQuery
      .find()
      .then(res=>{
          if(res.length){
            let tips = []
            res.forEach((v, k)=>{
              let temp = {
                'title':v.title,
                'url':v.url
              }
              tips.push(temp)
            })
            this.setData({tips})
          }
      })
      .catch(err=>{
        console.log(err)
      })
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    this.setTips()
    if(app.globalData.userId){
      let date = new Date()
      let dataQuery = Bmob.Query('Data')
      dataQuery.equalTo("year", "==", date.getFullYear().toString())
      dataQuery.equalTo("month", "==", (date.getMonth()+1).toString())
      dataQuery.equalTo("day", "==", date.getDate().toString())
      dataQuery.equalTo("userId", "==", app.globalData.userId)
      dataQuery
        .find()
        .then(res=>{
          console.log(res)
          if(res.length){
            let todayData = res[0]
            this.setData({
              'score':todayData.score,
              'height': todayData.height,
              'weight': todayData.weight,
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  //获取指定区间随机数
  getRandom: function (start, end, fixed = 0) {
    let differ = end - start
    let random = Math.random()
    return (start + differ * random).toFixed(fixed)
  },
  onShow:function(){
    this.onLoad()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goCalendar:function(e){
    if (app.globalData.userId != '') {
      wx.navigateTo({
        url: '/pages/calendar/calendar'
      })
    } else {
      wx.showToast({
        title: '还未登录',
      })
      setTimeout(() => {
        wx.hideToast();
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }, 1500)
    }
  },
})
