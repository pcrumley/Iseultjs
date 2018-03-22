<template>
  <div class="container">

    <div class="jumbotron">
      <div class="row">
    <div class="col-md-5">
        <img src="../assets/logo.png" class="img-fluid">
        </div>
    <div class="col-md-7">
      <h1 class="display-1">Iseult.js</h1>
      <p class="lead">A visualizer for particle-in-cell data created with Vue.js & D3. <br> by
         Patrick Crumley (patrick.crumley@gmail.com).</p>
      <hr class="my-4">
      <div class="mx-auto my-4 text-center">
        <h2>Please connect to an <a href="https://github.com/pcrumley/IseultServer"> Iseult Server </a></h2>
      </div>
      <form>
        <div class="form-group">
          <label for="formGroupServerName">Server Name</label>
          <input type="text" class="form-control" id="formGroupServerName" placeholder="My Computer" v-model="serverName">
        </div>
        <div class="form-group">
          <label for="formGroupServerURL">Server URL</label>
          <input type="text" class="form-control" :class="{'has-failure': !isOnline, 'has-success': isOnline}" id="formGroupServerURL" placeholder="localhost:5000" v-model="serverURL">
        </div>
      </form>

      <div class="mx-auto text-right">
        <router-link :to="{name: 'Help'}">
        <button type="button"
          class="btn btn-primary btn-lg">
          Help
        </button>
        </router-link>

        <router-link :to="{name: 'Charts'}" :event="!isOnline ? '' : 'click'">
        <button type="button"
          class="btn btn-lg"
          :class="{'btn-danger': !isOnline,
                   'btn-success': isOnline,
                      disabled: !isOnline}"
          @click="wrappedAddServer()">
          {{ btnMsg }}
          </button>
        </router-link>
      </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import * as types from '@/store/types'
import { mapActions } from 'vuex'

export default {
  name: 'SplashPage',
  data () {
    return {
      serverURL: 'localhost:5000',
      serverName: 'My Computer',
      isOnline: false
    }
  },
  computed: {
    cleanedServerURL () {
      if (this.serverURL.substring(0, 7) === 'http://') {
        return this.serverURL
      } else {
        return 'http://' + this.serverURL
      }
    },
    btnMsg () {
      if (this.isOnline) {
        return 'Connect'
      } else {
        return 'No server found'
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    serverURL: function (newServer, oldServer) {
      this.isOnline = false
      this.pingServer()
    }
  },
  methods: {
    ...mapActions({
      addServer: types.ADD_SERVER
    }),
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    wrappedAddServer () {
      if (this.isOnline) {
        this.addServer({name: this.serverName, url: this.serverURL})
      }
    },
    pingServer: _.debounce(
      function () {
        var vm = this
        axios.get(vm.cleanedServerURL + '/api/handshake')
          .then(function (response) {
            vm.isOnline = (response.data.name === 'IseultServer')
          })
          .catch(function (error) {
            vm.isOnline = false
            console.log(error)
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  },
  mounted () {
    this.pingServer()
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
  text-align: left;
}
.jumbotron {
  background-color: #FFFFFF;
}
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
}
.has-failure {
  border: 2px solid red;
}
.has-success {
  border: 2px solid green;
}

</style>
