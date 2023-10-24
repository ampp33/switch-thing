<template>
    <teleport to="body">
        <transition name="modal">
            <div v-if="show">
                <keh @keyup="$emit('on-keypress', $event)" />
                <div class="fog" @click="$emit('on-cancel')"></div>
                <div class="h-100 w-100 flex justify-center items-center">
                    <div class="modal">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import KeyboardEventHandler from '../ui/KeyboardEventHandler.vue'
export default {
    components: {
        'keh': KeyboardEventHandler
    },
    props: ['show'],
    emits: ['on-cancel', 'on-keypress']
}
</script>

<style scoped>
.container {
    padding: 2px;
    display: inline-block;
    margin-left: 5px;
    height: 25px;
    width: 25px;
}

.fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .5;
    z-index: 10;
}

.modal {
    color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 11;
}

.modal-enter-from, 
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: opacity .25s linear;
}

.modal-leave-active {
  transition: opacity .25s linear;
}
</style>