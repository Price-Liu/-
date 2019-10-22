

import * as echarts from '../../component/ec-canvas/echarts';
import Bomb from '../../utils/Bmob-2.2.1.min.js'


const app = getApp();


function getWeek(){
  let now = new Date();
  let year = now.getFullYear()
  let month = now.getMonth()
  let day = now.getDay() == 0 ? 7 : now.getDay()
  let today = now.getDate()
  let firstDayOfWeek = today - day + 1
  let lastDayOfWeek = firstDayOfWeek + 7 -1
  let week = []
  for(let i = firstDayOfWeek; i<=lastDayOfWeek; i++){
    week.push(i.toString())
  }
  return [year.toString(),(month+1).toString(),week]
}



Page({
  data: {

    ec: {

      // onInit: initChart

    },
    chart:'',

  },


  onLoad:function(){
    this.initChart()
    this.setOption()
  },
  onReady:function(){

  },
  onShow:function(){
    this.setOption()
  },
  setOption:function(chart){
    this.getOption()
      .then(res => {
        let weekData = getWeek()
        let scoreData = [0, 0, 0, 0, 0, 0, 0]
        weekData[2].forEach((v, k) => {
          res.forEach((v1, k1) => {
            if (v1.day == v) {
              scoreData[k] = parseInt(v1.score.split("分")[0])
            }
          })
        })
        let chart = this.chart



        var option = {

          title: {

            text: '本周健康指数',

            left: 'center'

          },

          color: ["#37A2DA", "#67E0E3", "#9FE6B8"],

          // legend: {

          //   data: ['A', 'B', 'C'],

          //   top: 50,

          //   left: 'center',

          //   backgroundColor: 'red',

          //   z: 100

          // },

          grid: {

            containLabel: true

          },

          tooltip: {

            show: true,

            trigger: 'axis'

          },

          xAxis: {

            type: 'category',

            boundaryGap: false,

            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

            // show: false

          },

          yAxis: {

            x: 'center',

            type: 'value',

            splitLine: {

              lineStyle: {

                type: 'dashed'

              }

            }

            // show: false

          },

          series: [{

            name: '健康指数',

            type: 'line',

            smooth: false,

            data: scoreData

          }]

        };
        chart.setOption(option)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getOption:function(){
    let query = Bomb.Query("Data")

    let weekData = getWeek()

    // query.equalTo('userId', app.globalData.userId)

    query.equalTo('year', "==", weekData[0])

    query.equalTo('month', "==", weekData[1])

    query.containedIn('day', weekData[2])

    return query.find()
  },
  initChart:function(){
    this.oneComponent = this.selectComponent('#myChart');
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.chart = chart;
      return chart;
    })
  }

});