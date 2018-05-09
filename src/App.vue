<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  --accent-color: #DCD6E0;
  --secondary-color: #DCD6E0;
  margin-top: 0px;
  margin-bottom: 70px;
}
span.katex-html {
  display: none;
}
</style>
