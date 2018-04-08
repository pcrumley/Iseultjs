<template>
  <div>
  <button v-if="!active" button type="button" class="btn btn-success btn-lg btn-block" @click="active=true">Add new chart</button>
  <div class="card my-2 " v-if="active">
  <div class="card-header text-left">
    Add new chart
  </div>
  <div class="card-body text-left" >
    <form>
      <div class="form-row form-group">
        <label for="chooseSubplotType" class='col-form-label col-sm-5'> Choose Chart Type: </label>
        <select class="form-control col-sm-5" id="chooseSubplotType" v-model="subplotType">
          <option v-for="(item, key) in chartTypeArr" :key="item" :value="key">
            {{ chartTypeArr[key] }}
          </option>
        </select>
      </div>
    </form>
    <component :is="subplotOptsComponent">
    </component>
    <div class="mx-auto text-right">
      <button type="button"
        class="btn btn-lg btn-danger"
        @click="active=false">
        Cancel
        </button>

    <button type="button"
      class="btn btn-lg btn-success">
      <!--@click="wrappedAddServer()">-->
        Add
    </button>
  </div>
</div>
</div>
</div>
</template>

<script>
import prtl2DHistForm from '@/components/PrtLHists/Prtl2DHistForm'
import * as types from '@/store/types'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SplashPage',
  data () {
    return {
      active: false,
      subplotType: 0
    }
  },
  computed: {
    ...mapGetters({
      chartTypeArr: types.AVAIL_CHART_TYPES
    }),
    subplotOptsComponent () {
      return prtl2DHistForm
    }
  },
  methods: {
    ...mapActions({
      addGraph: types.OPEN_GRAPH
    })
  },
  components:
  {
    Prtl2DHistForm: prtl2DHistForm
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
  text-align: left;
}
.has-failure {
  border: 2px solid red;
}
.has-success {
  border: 2px solid green;
}

</style>
