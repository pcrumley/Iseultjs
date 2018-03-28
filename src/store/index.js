import Vue from 'vue'
import Vuex from 'vuex'
import simulations from './modules/simulations'
import mainView from './modules/mainView'
import ui from './modules/ui'
import servers from '@/store/modules/servers'
import defaultGraphs from '@/store/modules/defaultGraphs'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({

  state: {
    serverArray: [
      {serverID: 0, name: 'MyComputer', path: 'http://localhost:5000'}
    ]
  },
  modules: {
    simulations,
    mainView,
    ui,
    defaultGraphs,
    servers
  },
  strict: debug
})
