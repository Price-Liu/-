// pages/calendar/calendar.js
import { setTodoLabels, getSelectedDay} from '../../component/calendar/main.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarConfig: {
      // 配置内置主题
      theme: 'elegant'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // setTodoLabels({
    //   // 待办点标记设置
    //   pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
    //   dotColor: '#40', // 待办点标记颜色
    //   circle: false, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
    //   showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
    //   days: [
    //     {
    //       year: 2019,
    //       month: 10,
    //       day: 14,
    //       todoText: '90kg'
    //     }
    //   ]
    // });
    this.onLoad()
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
  goForm:function(){
    let date = getSelectedDay()[0]
    console.log(date)
    //将年月日传入form表单中
    wx.navigateTo({
      url: `/pages/form/form?year=${date.year}&month=${date.month}&day=${date.day}`,
    })
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