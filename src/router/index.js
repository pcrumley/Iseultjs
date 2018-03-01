import Vue from 'vue'
import Router from 'vue-router'
import SplashPage from '@/components/SplashPage'
import sidebar from '@/components/sidebar'
import sidebarToggle from '@/components/sidebarToggle'
import ImageGraph from '@/components/ImageGraph'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplashPage',
      component: SplashPage
    },
    {
      path: '/image',
      name: 'imageGraph',
      component: ImageGraph
    },
    {
      path: '/',
      name: 'sidebar',
      component: sidebar
    },
    {
      path: '/',
      name: 'sidebarToggle',
      component: sidebarToggle
    }
  ]
})
