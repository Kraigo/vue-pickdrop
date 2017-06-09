import Vue from 'vue'
import App from './App.vue'

import VuePickdrop from '../src/vue-pickdrop';

Vue.use(VuePickdrop);

new Vue({
  el: '#app',
  render: h => h(App)
})