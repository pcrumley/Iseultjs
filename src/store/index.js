import Vue from 'vue'
import Vuex from 'vuex'
import ui from './modules/ui'
import axios from 'axios'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({

  state: {
    n: 3,
    server: 'http://localhost:5000',
    outdir: './test_output',
    cmaps: ['viridis']
  },
  mutations: {
    setCmapOpts (state, arr) {
      state.cmaps = arr
    }
  },
  actions: {
    loadCmaps ({ commit, state }) {
      axios.get(state.server + '/api/cmaps/')
        .then(function (response) {
          commit('setCmapOpts', response.data)
        })
        .catch(function (error) {
          console.log(error)
          commit('setCmapOpts', ['viridis'])
        })
    }
  },
  modules: {
    ui
  },
  strict: debug
})
