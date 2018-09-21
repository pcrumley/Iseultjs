<template>
  <div class="outer" :style="outerStyleObj">
    <div class="inner" :class="orient">
      <katex v-if="useTex" :mathstr="text"/>
      <span v-if="!useTex">{{text}}</span>
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
    'figMargin',
    'useTex'
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
      } else if (this.orient === 'labelRight') {
        return {
          height: this.figHeight - this.figMargin.bottom - this.figMargin.top + 'px',
          width: this.figMargin.right + 'px',
          top: '0px',
          left: 25 + this.figWidth - this.figMargin.right + 'px'
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
  /*font: 24px Avenir;*/
  font:18px Avenir;
  white-space:nowrap;
}
div.outer{
  position: absolute;
  top: 0px;
}
div.inner{
  position: absolute;
  user-select: none;
}

div.labelBottom{
 top: 45%;
 left: 40%;
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
