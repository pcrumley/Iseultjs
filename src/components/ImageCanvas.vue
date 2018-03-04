<template>
  <canvas :width="px" :height="py" v-insert-image="imgData"></canvas>
</template>

<script>
export default {
  name: 'ImageCanvas',
  props: ['px', 'py', 'imgData'],
  directives: {
    insertImage: function (canvasElement, binding) {
      // Get canvas context
      var ctx = canvasElement.getContext('2d')
      // Clear the canvas
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
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
  position: absolute;
    border: 2px solid black;
}
</style>
