// pages/mine/mine.js
const app = getApp()
const Bmob = require('../../utils/Bmob-2.2.1.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTx: '',
    defaultUrl: '../../images/avatar.jpg',
    username: '点击头像登录'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfoHandler:function(e){
    console.log(e.detail.userInfo)
    let userInfo = e.detail.userInfo
    this.setData({
      "userTx":e.detail.userInfo.avatarUrl,
      "username":e.detail.userInfo.nickName
    })
    Bmob.User.auth().then(res => {
      console.log(res)
      console.log('一键登陆成功')
      Bmob.User.upInfo(e.detail.userInfo).then(result => {
        console.log(result)
        app.globalData.userId = res.openid
        console.log(res.openid)
      }).catch(err => {
        console.log(err)
      })

    }).catch(err => {
      console.log(err)
    });
  },
  goSetting:function(e){
    wx.openSetting({
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})