<template>
    <transition name="loading" mode="out-in" @after-enter="transitionComplete" @after-leave="transitionComplete">
      <div class="loader-overlay" v-if="showLoading">
          <span class="loader" />
      </div>
    </transition>
</template>

<script>
export default {
    props: ['show', 'onLoadingComplete'],
    data() {
        return {
            showLoading: false,
            transitionInProgress: false,
            queuedTransition: false,
            queuedCallback: false
        }
    },
    watch: {
        show() {
            this.toggleLoading()
        }
    },
    methods: {
        transitionComplete() {
            this.transitionInProgress = false
            if(this.queuedCallback) {
                this.queuedCallback = false
                if(this.onLoadingComplete) this.onLoadingComplete()
            }
            if(this.queuedTransition) {
                this.queuedTransition = false
                this.toggleLoading()
            }
        },
        toggleLoading() {
            if(this.transitionInProgress) {
                this.queuedTransition = true
                this.queuedCallback = true
            } else {
                if(this.onLoadingComplete) this.onLoadingComplete()
                this.transitionInProgress = true
                this.showLoading = !this.showLoading
            }
        }
    }
}
</script>

<style scoped>
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
</style>