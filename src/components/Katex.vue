<template>
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
