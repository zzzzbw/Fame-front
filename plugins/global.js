import Vue from 'vue'
import util from './utils/fame'
import clickOutside from './clickoutside'

Vue.prototype.$util = util
Vue.directive('click-outside', clickOutside)
