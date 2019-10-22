// pages/form/form.js
const app = getApp()
const Bmob = require('../../utils/Bmob-2.2.1.min.js');
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',    //年
    month:'',    //月
    day:'',      //日
    height: '1.8',   //身高
    weight: '60',    //体重
    age: '18',     //年龄
    bmi: '18',    //BMI指数
    heartRate: '70', //心率
    sleep: {
      'start': '22:00',
      'end': '06:30'
    },
    exercise: {
      'start': '19:00',
      'end': '21:00'
    },
    work: {
      'start': '09:00',
      'end': '17:00'
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 'year': options.year ,'month':options.month,'day':options.day})
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
  //处理时间选择
  bindTimeChange: function (e) {
    let id = e.currentTarget.dataset.id
    let time = e.detail.value
    let sleep = this.data.sleep
    let exercise = this.data.exercise
    let work = this.data.work
    if (id == "sleep-start") {
      sleep.start = time
    }
    if (id == "sleep-end") {
      sleep.end = time
    }
    if (id == "exercise-start") {
      exercise.start = time
    }
    if (id == "exercise-end") {
      exercise.end = time
    }
    if (id == "work-start") {
      work.start = time
    }
    if (id == "work-end") {
      work.end = time
    }
    this.setData({ work, exercise, sleep })
  },
  //处理用户输入
  inputHandler: function (e) {
    let id = e.currentTarget.dataset.id
    let height = this.data.height
    let weight = this.data.weight
    let age = this.data.age
    let heartRate = this.data.heartRate
    let bmi = this.data.bmi
    let temp = e.detail.value
    if(id == "height"){
      height = temp
    }
    if (id == "weight") {
      weight = temp
    }

    if (id == "age") {
      age = temp
    }

    if (id == "heartRate") {
      heartRate = temp
    }

    if (id == "bmi") {
      bmi = temp
    }
    this.setData({height, weight, age, heartRate, bmi})


  },
  //提交数据
  submitData: function () {
    let equalDataQuery = Bmob.Query('Data')
    equalDataQuery.equalTo("year", "==",this.data.year)
    equalDataQuery.equalTo("month", "==", this.data.month)
    equalDataQuery.equalTo("day", "==", this.data.day)
    equalDataQuery.equalTo("userId", "==", app.globalData.userId)
    equalDataQuery
      .find()
      .then(equalRes=>{
        console.log(equalRes)
        let dataQuery = Bmob.Query('Data')
        let score = this.calcScore()
        if (equalRes.length){
          dataQuery.set('id',equalRes[0].objectId)
        }
        dataQuery.set("height", this.data.height)
        dataQuery.set("weight", this.data.weight)
        dataQuery.set("year", this.data.year)
        dataQuery.set("month", this.data.month)
        dataQuery.set("day", this.data.day)
        dataQuery.set("userId", app.globalData.userId)
        dataQuery.set("score", score)
        dataQuery
          .save()
          .then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
      })
  },
  //计算分数
  calcScore: function () {
    let score
    //1. 计算bmi部分
    let height = this.data.height
    let weight = this.data.weight
    let bmi
    if (height) {
      bmi = weight / (height * height)
    }
    let bmiScore
    if (bmi < 18.5) {
      bmiScore = this.getRandom(0, 12)
    } else if (bmi < 23.9) {
      bmiScore = this.getRandom(12, 20)
    } else if (bmi < 26.9) {
      bmiScore = 10
    } else if (bmi < 29.9) {
      bmiScore = 8
    } else if (bmi < 40) {
      bmiScore = 6
    } else {
      bmiScore = 4
    }
    //2. 计算心率部分
    let heartRate = this.data.heartRate
    let heartRateScore = 20
    if (heartRate > 70) {
      heartRateScore -= (heartRate - 70) * 3
    }
    if (heartRate < 55) {
      heartRateScore -= (55 - heartRate) * 3
    }
    if (heartRateScore < 0) {
      heartRateScore = 0
    }
    //3. 计算时间部分
    let work = this.data.work
    let sleep = this.data.sleep
    let exercise = this.data.exercise
    let timeScore, workScore, sleepScore, exerciseScore
    //工作分数
    let workArr = this.transTime(work)
    let workTime = (workArr[1].getTime() - workArr[0].getTime()) / (3600 * 1000)
    workScore = (workTime - 8) < 0 ? 0 : -3 * parseInt((workTime - 8) * 2)
    //锻炼分数
    let exerciseArr = this.transTime(exercise)
    let exerciseTime = (exerciseArr[1].getTime() - exerciseArr[0].getTime()) / (3600 * 1000)
    exerciseScore = exerciseTime < 0 ? 0 : 3 * parseInt((workTime - 8) * 2)
    //睡眠分数
    sleepScore = 0
    let sleepArr = this.transTime(sleep)
    let sleepStartTime = sleepArr[0].getTime()
    let sleepEndTime = sleepArr[1].getTime()
    let sleepTime = sleepStartTime > sleepEndTime ? (sleepEndTime - sleepStartTime) / (3600 * 1000) + 24 : (sleepEndTime - sleepStartTime) / (3600 * 1000)
    if (sleepTime < 7) {
      sleepScore = -3 * parseInt((7 - sleepTime) * 2)
    }
    if (sleepTime > 10) {
      sleepScore = -3 * parseInt((sleepTime - 10) * 2)
    }
    timeScore = 60 + workScore + exerciseScore + sleepScore
    if (timeScore > 60) {
      timeScore = 60
    }
    if (timeScore < 0) {
      timeScore = 0
    }
    //计算总分
    score = parseInt(bmiScore) + parseInt(heartRateScore) + parseInt(timeScore)
    console.log(timeScore)
    console.log(heartRateScore)
    console.log(bmiScore)
    return score +'分'
  },
  //获取指定区间随机数
  getRandom: function (start, end, fixed = 0) {
    let differ = end - start
    let random = Math.random()
    return (start + differ * random).toFixed(fixed)
  },
  //将时间字符串转换为两个时间戳返回
  transTime: function (t) {
    let startArr = t.start.split(":")
    let endArr = t.end.split(":")
    let start = new Date();
    let end = new Date();
    start.setHours(startArr[0])
    start.setMinutes(startArr[1])
    end.setHours(endArr[0])
    end.setMinutes(endArr[1])
    return [start, end]
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