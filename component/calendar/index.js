import Week from './func/week';
import { Logger, Slide } from './func/utils';
import Bmob from '../../utils/Bmob-2.2.1.min.js'
const app = getApp()
import initCalendar, {
  jump,
  getCurrentYM,
  whenChangeDate,
  renderCalendar,
  whenMulitSelect,
  whenSingleSelect,
  getCalendarDates,
  setTodoLabels
} from './main.js';

const slide = new Slide();
const logger = new Logger();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    calendarConfig: {
      type: Object,
      value: {}
    }
  },
  data: {
    handleMap: {
      prev_year: 'chooseYear',
      prev_month: 'chooseMonth',
      next_month: 'chooseMonth',
      next_year: 'chooseYear'
    }
  },

  lifetimes: {
    attached: function () {
      this.initComp();
    }
  },
  attached: function () {
    this.initComp();
  },
  methods: {
    initComp() {
      const calendarConfig = this.properties.calendarConfig || {};
      this.setTheme(calendarConfig.theme);
      initCalendar(this, calendarConfig);
      this.setLabelsOfTheMonth('2019','10')
    },
    setTheme(theme) {
      this.setData({
        'calendarConfig.theme': theme || 'default'
      });
    },
    //设置本月所有的label
    setLabelsOfTheMonth(year, month) {
      let dataQuery = Bmob.Query('Data')
      dataQuery.equalTo("year", "==", year)
      dataQuery.equalTo("month", "==", month)
      dataQuery.equalTo("userId", "==", app.globalData.userId)
      dataQuery.find().then(res => {
        console.log(res)
      });
      dataQuery
        .find()
        .then(res => {
          console.log(res)
          let daysData = []
          //遍历查询结果将数据写入labels中
          res.forEach((v, k)=>{
            console.log(k)
            console.log(v)
            //label模板
            let temp ={
              'year':year,
              'month':month,
              'day':v.day,
              'todoText':v.score,
            }
            daysData.push(temp)
          })
          setTodoLabels({
            // 待办点标记设置
            pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
            dotColor: '#40', // 待办点标记颜色
            circle: false, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
            showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
            days: daysData
          });
        }).catch(err => {
          console.log(err)
        })

    },
    chooseDate(e) {
      const { type } = e.currentTarget.dataset;
      if (!type) return;
      const methodName = this.data.handleMap[type];
      this[methodName](type);
      console.log(e)
    },
    chooseYear(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月');
      if (this.weekMode) {
        return console.warn('周视图下不支持点击切换年月');
      }
      let newYear = +curYear;
      let newMonth = +curMonth;
      if (type === 'prev_year') {
        newYear -= 1;
      } else if (type === 'next_year') {
        newYear += 1;
      }
      this.render(curYear, curMonth, newYear, newMonth);
    },
    chooseMonth(type) {
      const { curYear, curMonth } = this.data.calendar;
      if (!curYear || !curMonth) return logger.warn('异常：未获取到当前年月');
      if (this.weekMode) return console.warn('周视图下不支持点击切换年月');
      let newYear = +curYear;
      let newMonth = +curMonth;
      if (type === 'prev_month') {
        newMonth = newMonth - 1;
        if (newMonth < 1) {
          newYear -= 1;
          newMonth = 12;
        }
      } else if (type === 'next_month') {
        newMonth += 1;
        if (newMonth > 12) {
          newYear += 1;
          newMonth = 1;
        }
      }
      this.render(curYear, curMonth, newYear, newMonth);
      this.setLabelsOfTheMonth(newYear.toString(), newMonth.toString())
    },
    render(curYear, curMonth, newYear, newMonth) {
      whenChangeDate.call(this, {
        curYear,
        curMonth,
        newYear,
        newMonth
      });
      this.setData({
        'calendar.curYear': newYear,
        'calendar.curMonth': newMonth
      });
      renderCalendar.call(this, newYear, newMonth);
    },
    /**
     * 日期点击事件
     * @param {!object} e 事件对象
     */
    tapDayItem(e) {
      const { idx, disable } = e.currentTarget.dataset;
      if (disable) return;
      let currentSelected = {}; // 当前选中日期
      let { days, selectedDay: selectedDays, todoLabels } =
        this.data.calendar || []; // 所有选中日期
      const config = this.config || {};
      const { multi, onTapDay } = config;
      const opts = {
        e,
        idx,
        onTapDay,
        todoLabels,
        selectedDays,
        currentSelected,
        days: days.slice()
      };
      if (multi) {
        whenMulitSelect.call(this, opts);
      } else {
        whenSingleSelect.call(this, opts);
      }
      console.log(opts)
    },
    doubleClickToToday() {
      if (this.config.multi || this.weekMode) return;
      if (this.count === undefined) {
        this.count = 1;
      } else {
        this.count += 1;
      }
      if (this.lastClick) {
        const difference = new Date().getTime() - this.lastClick;
        if (difference < 500 && this.count >= 2) {
          jump.call(this);
        }
        this.count = undefined;
        this.lastClick = undefined;
      } else {
        this.lastClick = new Date().getTime();
      }
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0];
      const startX = t.clientX;
      const startY = t.clientY;
      this.slideLock = true; // 滑动事件加锁
      this.setData({
        'gesture.startX': startX,
        'gesture.startY': startY
      });
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const { gesture } = this.data;
      if (!this.slideLock) return;
      if (slide.isLeft(gesture, e.touches[0])) {
        this.setData({
          'calendar.leftSwipe': 1
        });
        if (this.weekMode) {
          this.slideLock = false;
          this.currentDates = getCalendarDates();
          this.currentYM = getCurrentYM();
          Week(this).calculateNextWeekDays();
          this.onSwipeCalendar('next_week');
          this.onWeekChange('next_week');
          return;
        }
        this.chooseMonth('next_month');
        this.onSwipeCalendar('next_month');
        this.slideLock = false;
      }
      if (slide.isRight(gesture, e.touches[0])) {
        this.setData({
          'calendar.rightSwipe': 1
        });
        if (this.weekMode) {
          this.slideLock = false;
          this.currentDates = getCalendarDates();
          this.currentYM = getCurrentYM();
          Week(this).calculatePrevWeekDays();
          this.onSwipeCalendar('prev_week');
          this.onWeekChange('prev_week');
          return;
        }
        this.chooseMonth('prev_month');
        this.onSwipeCalendar('prev_month');
        this.slideLock = false;
      }
    },
    calendarTouchend(e) {
      this.setData({
        'calendar.leftSwipe': 0,
        'calendar.rightSwipe': 0
      });
    },
    onSwipeCalendar(direction) {
      this.triggerEvent('onSwipe', {
        directionType: direction
      });
    },
    onWeekChange(direction) {
      this.triggerEvent('whenChangeWeek', {
        current: {
          currentYM: this.currentYM,
          dates: [...this.currentDates]
        },
        next: {
          currentYM: getCurrentYM(),
          dates: getCalendarDates()
        },
        directionType: direction
      });
      this.currentDates = null;
      this.currentYM = null;
    }
  }
});
