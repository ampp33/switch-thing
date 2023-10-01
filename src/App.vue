<template>
  <the-header />
  <div class="content">
    <router-view v-slot="slotProps">
      <transition name="router" mode="out-in">
        <component :is="slotProps.Component" />
      </transition>
    </router-view>
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

<style scoped>
.router-enter-from {
  opacity: 0;
  /* transform: scale(-30px); */
  transform: translateX(-30px);
}

.router-enter-to,
.router-leave-from {
  opacity: 1;
  /* transform: scale(0px); */
}

.router-enter-active {
  transition: all 0.4s ease-out;
}

.router-leave-active {
  transition: all 0.4s ease-in;
}

.router-leave-to {
  opacity: .5;
  /* transform: scale(); */
  transform: translateX(30px);
}
</style>