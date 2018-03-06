<template>
  <div class="outer" :style="outerStyleObj">
    <div class="inner" :class="orient">
      <katex :mathstr="text"/>
    </div>
  </div>
</template>

<script>
import katex from '@/components/Katex.vue'
export default {
  name: 'AxisLabel',
  props: [
    'orient',
    'text',
    'figWidth',
    'figHeight',
    'figMargin'
  ],
  computed: {
    outerStyleObj () {
      if (this.orient === 'labelBottom') {
        return {
          height: this.figMargin.bottom + 'px',
          left: this.figMargin.left + 'px',
          top: this.figHeight - this.figMargin.bottom + 'px',
          width: this.figWidth - this.figMargin.left - this.figMargin.right + 'px'
        }
      } else if (this.orient === 'labelLeft') {
        return {
          height: this.figHeight - this.figMargin.bottom - this.figMargin.top + 'px',
          width: this.figMargin.left + 'px',
          top: '0px',
          left: '-20px'
        }
      }
    }
  },
  components: {
    katex
  }
}
</script>
<style scoped>
div {
  font: 24px Avenir;

}
div.outer{
  position: absolute;
  top: 0px;
}
div.inner{
  position: absolute;
}

div.labelBottom{
 top: 45%;
 left: 50%;
}

div.labelLeft{
 transform: translateX(-50%) translateY(-50%) rotate(-90deg);
 top: 55%;
 left: 50%;
}

div.labelRight{
 transform: translateX(-50%) translateY(-50%) rotate(90deg);
 top: 55%;
 left: 50%;
}
</style>
