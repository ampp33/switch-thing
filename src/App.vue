<template>
  <div>
    <Search />
    <Switch :switchObj="switchObj" />
  </div>
</template>

<script>
import sampleSwitch from './assets/switch.json'
import Switch from './components/Switch.vue'
import Search from './components/Search.vue'

export default {
  name: 'App',
  components: {
    Switch,
    Search
  },
  data() {
    return {
      switchObj: sampleSwitch
    }
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
} */
</style>
