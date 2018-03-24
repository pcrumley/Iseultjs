<template>
  <div>
  <button v-if="!active" button type="button" class="btn btn-success btn-lg btn-block" @click="active=true">Add new simulation</button>
  <div class="card my-2 " v-if="active">
  <div class="card-header text-left">
    Add new simulation:
  </div>
  <div class="card-body text-left" >
    <form>
      <div class="form-group ">
        <label for="formGroupServerName">Simulation Name</label>
        <input type="text" class="form-control" id="formGroupServerName" placeholder="My Sim" v-model="simName">
      </div>

      <div class="form-group">
        <label for="exampleFormControlSelect1"> Choose server </label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="serverLoc">
          <option v-for="(item, key) in serverArr" :key="item" :value="key">
            {{ serverNames[key] }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1"> Sim Type </label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="simTypeID">
          <option v-for="(item, key) in availSimTypes" :key="key" :value="key">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1"> Output Directory </label>
        <ul class="list-group">
  <li class="list-group-item curdir clickable" @dblclick="curDir=parentDir">
    <span ><font-awesome-icon :icon="openFolderIcon" /></span>
    {{ curDir }}
    <div class="float-right " ><font-awesome-icon :icon="lvlUpIcon" /></div>
  </li>
   <dir-item
    v-for="(item, key) in dirList"
    :key="key"
    :class="{
      active: key===clickedDir,
      hoverable: key !==clickedDir
    }"
    @click.native="clickedDir=key"
    @dblclick.native="curDir+='/'+item">
      {{ item }}
  </dir-item>

</ul>
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
        @click="wrappeAddSimulation()">
        Add
        </button>
      </div>
</div>
</div>
</div>
</template>

<script>
import axios from 'axios'
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen'
import faLevelUp from '@fortawesome/fontawesome-free-solid/faLongArrowAltUp'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import dirItem from '@/components/Sidebar/Sims/dirItem'
import * as types from '@/store/types'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SplashPage',
  data () {
    return {
      active: false,
      serverLoc: 0,
      simTypeID: 0,
      clickedDir: -1,
      simName: '',
      parentDir: '',
      curDir: '',
      dirList: []
    }
  },
  computed: {
    ...mapGetters({
      serverArr: types.GET_SERVER_ARR,
      serverMap: types.GET_SERVER_MAP
    }),
    openFolderIcon () {
      return faFolderOpen
    },
    cleanedServerURL () {
      if (this.serverURL.substring(0, 7) === 'http://') {
        return this.serverURL
      } else {
        return 'http://' + this.serverURL
      }
    },
    lvlUpIcon () {
      return faLevelUp
    },
    serverURL () {
      return this.serverMap.get(this.serverID).url
    },
    serverID () {
      return this.serverArr[this.serverLoc]
    },
    simType () {
      return this.availSimTypes[this.simTypeID]
    },
    serverNames () {
      var tmpArr = []
      this.serverArr.forEach((el) => {
        tmpArr.push(this.serverMap.get(el).name)
      })
      return tmpArr
    },
    availSimTypes () {
      return this.serverMap.get(this.serverID).simTypes
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
    serverID: function (newID, oldID) {
      this.curDir = this.serverMap.get(newID).serverDir
    },
    curDir: function (newDir, oldDir) {
      this.dirList = []
      this.clickedDir = -1
      this.pingServer()
    }
  },
  methods: {
    ...mapActions({
      addSimulation: types.OPEN_SIMULATION
    }),
    wrappeAddSimulation: function () {
      this.active = false
      this.addSimulation({
        serverID: this.serverID,
        serverURL: this.cleanedServerURL,
        serverName: this.serverNames[this.serverLoc],
        simType: this.simType,
        outdir: this.curDir,
        name: this.simName
      })
    },
    pingServer:
      function () {
        var vm = this
        axios.get(vm.cleanedServerURL + '/dirs' + vm.curDir)
          .then(function (response) {
            vm.dirList = response.data.dirs
            vm.parentDir = response.data.parentDir
          })
          .catch(function (error) {
            console.log(error)
          })
      }
  },
  mounted () {
    this.pingServer()
    this.curDir = this.serverMap.get(this.serverID).serverDir
  },
  components: {
    FontAwesomeIcon,
    dirItem
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
  text-align: left;
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
.curdir {
  background-color: #F0F0F0;
  user-select: none;
}
.clickable{cursor: pointer;}

</style>
