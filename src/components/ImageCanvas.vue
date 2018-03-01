<template>
  <div>
  <canvas :width="px" :height="px" v-insert-image="imgString"></canvas>
  <p>Input the for flask server
    <input v-model="imgSrc">
  </p>
  <p> {{ imgString }} </p>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'ImageCanvas',
  data () {
    return {
      px: 400,
      py: 400,
      imgSrc: 'http://127.0.0.1:5000/api/2dhist/imgs/?sim_type=tristan-mp&outdir=test_output/&n=1&prtl_type=ions&xval=x&yval=px&cnorm=log&xmin=150',
      imgString: ''
    }
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
        axios.get(vm.imgSrc)
          .then(function (response) {
            console.log(response.data.imgString)
            vm.imgString = response.data.imgString
          })
          .catch(function (error) {
            vm.imgString = ''
            console.log(error)
          })
      },
      500
    )
  },
  directives: {
    insertImage: function (canvasElement, binding) {
      // Get canvas context
      var ctx = canvasElement.getContext('2d')
      // Clear the canvas
      ctx.clearRect(0, 0, 400, 400)
      // Insert stuff into canvas
      var image = new Image()
      image.onload = function () {
        ctx.drawImage(image, 0, 0)
      }
      image.src = binding.value
      ctx.drawImage(image, 0, 0)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
    border: 2px solid black ;
}
</style>
