<template>
  <g :transform='axisTransform'>
  </g>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'IseultAxis',
  props: [
    'orient',
    'scale',
    'height',
    'width',
    'margin'
  ],
  computed: {
    axisTransform () {
      var x = this.orient === 'axisRight' ? this.width + this.margin.left + this.margin.hspace : this.margin.left
      var y = this.orient === 'axisBottom' ? this.height + this.margin.top : this.margin.top

      return 'translate(' + x + ',' + y + ')'
    }
  },
  methods: {
    drawAxis () {
      d3.select(this.$el)
        .call(d3[this.orient](this.scale))
    }
  },
  watch: {
    scale: function (newScale, oldScale) {
      this.drawAxis()
    }
  },
  aftermounted: function () {
    this.drawAxis()
  }
}
</script>
<style scoped>
g {
  font: 14px Avenir;
  shape-rendering: crispEdges;
}
</style>
