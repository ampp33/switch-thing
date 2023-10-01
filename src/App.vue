<template>
  <the-header />
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from './components/ui/TheHeader.vue'

export default {
  name: 'App',
  components: {
    TheHeader
  },
  data() {
    return {

    }
  }
}
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 20px;
  background-color: #262335;
  color: white;
}

h2 {
    font-weight: 400;
    font-size: 28px;
    font-style: italic;
}

.content {
  padding: 0px 25px 25px 25px
}

a {
  color: lightcoral;
  text-decoration: none;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}
</style>