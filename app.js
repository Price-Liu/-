//app.js

//引入Bomb SDK
const Bomb = require('./utils/Bmob-2.2.1.min.js')
// 初始化
let SECRECT_KEY = '9dee5cdc7fec7069'
let API_CODE = '123456'

Bomb.initialize(SECRECT_KEY, API_CODE)
App({
  globalData: {
    userId:''
  }
})