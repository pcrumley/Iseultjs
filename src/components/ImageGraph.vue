<template>
  <div>
  <iseult-image-canvas :px="px" :py="py" :imgData="imgObj.pngData"></iseult-image-canvas>
  <p>Input the for flask server
    <input v-model="imgSrc">
  </p>
  <p> {{ imgObj.xmin/2 }} </p>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import ImageCanvas from './ImageCanvas.vue'
export default {
  name: 'ImageGraph',
  data () {
    return {
      px: 400,
      py: 400,
      imgSrc: 'http://127.0.0.1:5000/api/2dhist/imgs/?sim_type=tristan-mp&outdir=test_output/&n=1&prtl_type=ions&xval=x&yval=px&cnorm=log&xmin=150',
      imgObj: {
        'pngData': '',
        'xmin': '',
        'xmax': '',
        'ymin': '',
        'ymax': '',
        'vmin': '',
        'vmax': '',
        'cmap': ''
      }
    }
  },
  components: {
    'iseultImageCanvas': ImageCanvas
  },
  watch: {
    imgSrc: function (newSrc, oldSrc) {
      this.getImg()
    }
  },
  methods: {
    getImg: _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgSrc + '&px=' + this.px + '&py=' + this.py)
          .then(function (response) {
            vm.imgObj.pngData = response.data.imgString
            vm.imgObj.cmap = response.data.cmap
            vm.imgObj.xmin = parseFloat(response.data.xmin)
            vm.imgObj.xmax = parseFloat(response.data.xmax)
            vm.imgObj.ymin = parseFloat(response.data.ymin)
            vm.imgObj.ymax = parseFloat(response.data.ymax)
            vm.imgObj.vmin = parseFloat(response.data.cmin)
            vm.imgObj.vmax = parseFloat(response.data.cmax)
          })
          .catch(function (error) {
            vm.imgString = ''
            console.log(error)
          })
      },
      500
    )
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
