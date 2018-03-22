<template>
  <div>
  <button v-if="!active" button type="button" class="btn btn-success btn-lg btn-block" @click="active=true">Add new connection</button>
  <div class="card my-2 " v-if="active">
  <div class="card-header text-left">
    Add new server
  </div>
  <div class="card-body text-left" >
    <form>
      <div class="form-group ">
        <label for="formGroupServerName">Server Name</label>
        <input type="text" class="form-control" id="formGroupServerName" placeholder="My Computer" v-model="serverName">
      </div>
      <div class="form-group">
        <label for="formGroupServerURL">Server URL</label>
        <input type="text" class="form-control" :class="{'has-failure': !isOnline, 'has-success': isOnline}" id="formGroupServerURL" placeholder="localhost:5000" v-model="serverURL">
      </div>
    </form>

      <div class="mx-auto text-right">
        <button type="button"
          class="btn btn-lg btn-danger"
          @click="active=false">
          Cancel
          </button>

      <button type="button"
        class="btn btn-lg btn-success"
        :class="{'disabled': !isOnline}"
        @click="wrappedAddServer()">
        Connect
        </button>
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
      active: false,
      serverURL: 'localhost:5000',
      serverName: 'TigressData',
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
        return 'Cancel'
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

    wrappedAddServer () {
      if (this.isOnline) {
        this.active = false
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
