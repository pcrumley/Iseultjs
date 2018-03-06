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
    compileLatex: function (element, binding) {
      // Get canvas context
      katex.render(binding.value, element)
    }
  }

}
</script>

<style scoped>
span {
  margin: 0px;
}
</style>
