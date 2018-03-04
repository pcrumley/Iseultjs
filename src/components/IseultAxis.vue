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
    'width'
  ],
  computed: {
    axisTransform () {
      var x = this.orient === 'axisRight' ? this.width : 0
      var y = this.orient === 'axisBottom' ? this.height : 0
      return 'translate(' + x + ',' + y + ')'
    },
    scale () {
      return d3[this.scaleType]()
        .range(this.range)
        .domain(this.domain)
    },
    mounted: function () {
      d3.select(this.$el)
        .call(d3[this.orient](this.scale))
      console.log('hi ')
      return console.log('hi')
    }
  }
}
</script>
