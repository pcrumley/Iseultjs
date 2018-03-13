import Vue from 'vue'
import Vuex from 'vuex'
import simulations from './modules/simulations'
import mainView from './modules/mainView'
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
    mainView
  },
  strict: debug
})
