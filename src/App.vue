<template>
  <the-header />
  <teleport to="body">
    <transition name="loading" mode="out-in" @after-enter="loadingStore.transitionComplete" @after-leave="loadingStore.transitionComplete">
      <div class="loader-overlay" v-if="loadingStore.isLoading">
          <span class="loader" />
      </div>
    </transition>
  </teleport>
  <div class="content">
    <router-view v-slot="slotProps">
      <transition name="router" mode="out-in">
        <component :is="slotProps.Component" />
      </transition>
    </router-view>
  </div>
  <the-footer />
</template>

<script>
import { mapStores } from 'pinia';
import { useLoadingStore } from './stores/loading-store'
import TheHeader from './components/ui/TheHeader.vue'
import TheFooter from './components/ui/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  },
  computed: {
    ...mapStores(useLoadingStore)
  },
  methods: {},
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
    /* transform: translateY(40px); */

    &:hover {
        background: linear-gradient(93deg, #383252 -54.66%, #835dff 96.5%);
    }
}

/* loader */
.loader, .loader:before, .loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: bblFadInOut 1.8s infinite ease-in-out;
}
.loader {
  color: #FFF;
  font-size: 7px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}

@keyframes bblFadInOut {
  0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
  40% { box-shadow: 0 2.5em 0 0 }
}

.loader-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: .9;
  background-color: #000;
}

.loading-enter-from, 
.loading-leave-to {
  opacity: 0
}

.loading-enter-active {
  transition: opacity .25s linear;
}

.loading-leave-active {
  transition: opacity .25s linear;
}
/* loader */

/* vue dropdown custom styling */
.multiselect__option--highlight {
  background-color: #835dff;
}

.multiselect__option--selected {
  background-color: lightcoral;
}

.multiselect__option--selected.multiselect__option--highlight {
  background-color: lightcoral;
}

.multiselect__option--selected.multiselect__option--highlight::after {
  background-color: red;
}
</style>


<style scoped>
.router-enter-from,
.router-leave-to {
  opacity: 0;
}

.router-enter-active,
.router-leave-active {
  transition: all 0.4s ease;
}
</style>