<template>
  <div class="splash">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <p>A visualizer for particle-in-cell data created with Vue.js & D3. <br> Written by
       Patrick Crumley (patrick.crumley@gmail.com).
       </p>
    <h2> Please connect to an Iseult Server* </h2>
    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="400">
      <tr>
        <td width="33%">Name: </td>
        <td width="33%"><input v-model="serverList[0].name"></td>
        <td rowspan = 2>  <button :class='{hasError: !isOnline}' :disable='!isOnline'> {{ isOnline ? 'Go' : 'X' }} </button> </td>
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
  name: 'SplashPage',
  data () {
    return {
      msg: 'Welcome to Iseult.js',
      serverList: [
        {id: 0, name: 'Server1', path: ''}
      ],
      isOnline: false
    }
  }
  /*
  watch: {
    // whenever question changes, this function will run
    serverList: function (newServer, oldSever) {
      this.isOnline  = false
      this.pingServer()
    }
  },
  methods: {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        axios.get(vm.serverList[0].name + '/api/handshake')
          .then(function (response) {
            vm.isOnline = (response.data.name === 'IseultServer')
          })
          .catch(function (error) {
            vm.isOnline = false + error
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  }
  */
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  margin-left: auto;
  margin-right: auto;
}
td {
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: right;
}
button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    width: 75px;
    height: 50px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
.hasError {
    background-color: #FF0000; /* red */
    border: none;
    opacity: 0.6;
    color: white;
    width: 75px;
    height: 50px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

</style>
