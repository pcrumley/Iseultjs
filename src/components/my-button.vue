<template>
  <div class="">
    <h1>{{ msg }}</h1>
    <p>A visualizer for particle-in-cell data created with Vue.js & D3. <br> Written by
       Patrick Crumley (patrick.crumley@gmail.com).
       </p>
    <h2> Please connect to an Iseult Server* </h2>
    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="400">
      <tr>
        <td width="33%">Name: </td>
        <td width="33%"><input v-model="serverList[0].name"></td>
        <td rowspan = 2>  <button class='hasError'> Go </button> </td>
      </tr>
      <tr>
        <td width="33%">URL: </td>
        <td width="33%"><input v-model="serverList[0].path"></td>
      </tr>
    </table>

    <p>*Requires an IseultServer instance that has access to the data of your simulation.*</p>

  </div>
</template>

<script>
export default {
  name: 'myButton',
  data () {
    return {
      msg: 'X',
      // imageSrc: 'http://127.0.0.1:8000/api/imgs/?n=1
      serverList: [
        {id:0, name: 'Server1', path: ''}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
.hasError {
    background-color: #FF0000; /* Green */
    border: none;
    opacity: 0.6;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

</style>
