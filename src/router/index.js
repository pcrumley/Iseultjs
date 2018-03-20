import Vue from 'vue'
import Router from 'vue-router'
import SplashPage from '@/components/SplashPage'
// import Prtl2DHist from '@/components/PrtlHists/Prtl2DHistForm'
import Charts from '@/components/Charts'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplashPage',
      component: SplashPage
    },
    {
      path: '/charts',
      name: 'Charts',
      component: Charts
    }
  ]
})
