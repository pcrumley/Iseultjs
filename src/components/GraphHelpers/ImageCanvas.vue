<template>
  <canvas :width="imgObj.imgX"
          :height="imgObj.imgY"
          :style="{ left: imgObj.left + 'px', top: imgObj.top +'px'}"
                    v-insert-image="imgObj.imgData">
  </canvas>
</template>

<script>
export default {
  name: 'ImageCanvas',
  props: ['imgObj'],
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
}

</style>
