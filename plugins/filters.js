import Vue from 'vue'
import FameUtil from './utils/fame'
import hljs from './highlight'

function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 *  引用highlight
 */
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

/**
 * 时间格式化filter
 */
Vue.filter('time', (time, format) => {
  var date = new Date(time)
  return formatDate(date, format || 'yyyy-mm-dd HH:ss')
})

/**
 * 分类格式化
 */
Vue.filter('formatCategory', (category) => {
  return category || FameUtil.STATIC.DEFAULT_CATEGORY
})

/**
 * 根据逗号分割成数组
 */
Vue.filter('splitArray', (str) => {
  return str.split(',')
})
