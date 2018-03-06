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
    'scaleType',
    'range',
    'domain',
    'height',
    'width',
    'margin'
  ],
  computed: {
    axisTransform () {
      console.log(this.height)
      var x = this.orient === 'axisRight' ? this.width + this.margin.left + this.margin.hspace : this.margin.left
      var y = this.orient === 'axisBottom' ? this.height + this.margin.top : this.margin.top

      return 'translate(' + x + ',' + y + ')'
    },
    scale () {
      return d3[this.scaleType]()
        .range(this.range)
        .domain(this.domain)
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
  mounted: function () {
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
