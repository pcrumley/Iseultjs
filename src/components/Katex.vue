<template>
  <!--
  A SIMPLE VUE COMPONENT THAT ALLOWS RENDERING OF
  LATEX COMMANDS
  -->
  <span v-compile-latex="mathstr">
  </span>
</template>

<script>
import katex from 'katex'
export default {
  name: 'LatexText',
  props: [
    'mathstr'
  ],
  directives: {
    compileLatex: function (el, binding) {
      // Get canvas context
      katex.render(binding.value, el)
    }
  }

}
</script>

<style scoped>
span {
  margin: 0px;
  font-size: 16px !important;
}
</style>
