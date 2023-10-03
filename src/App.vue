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
  font-family: 'Rubik', sans-serif;
  color: #D2DBED;
  font-size: 20px;
  background-color: #262335;
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

.search-button {
    display: inline-block;
    margin: 5px 5px 5px 0px;
    padding: 6px 13px;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    background: linear-gradient(93deg, #383252 -54.66%, #A387FE 96.5%);
    width: 127px;
    height: 37px;
    color: #FFFFFF;
    font-size: 20px;
    text-align: center;
    transform: translateY(40px);

    &:hover {
        background: linear-gradient(93deg, #383252 -54.66%, #835dff 96.5%);
    }
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