<template>
    <div class="reference-container">
        <keh @keyup="handleKeyPresses" />
        <div class="reference-icon" @click="showPopup = !showPopup"></div>
        <teleport to="body" >
            <transition name="ref-overlay">
                <div v-if="showPopup">
                    <div class="reference-fog" @click="closeAndReset"></div>
                    <div class="h-100 w-100 flex justify-center items-center">
                        <div class="reference-dialog">
                            <div class="mb2">References</div>
                            <textarea v-model="currentReferences" class="w-100 h-100"></textarea>
                            <div>
                                <button type="button" @click="save" class="w3 mt2 mr2">OK</button>
                                <button type="button" @click="closeAndReset" class="w4 mt2">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script>
import KeyboardEventHandler from '../ui/KeyboardEventHandler.vue'
export default {
    components: {
        'keh': KeyboardEventHandler
    },
    props: ['references'],
    data() {
        return {
            showPopup: false,
            currentReferences: ''
        }
    },
    watch: {
        // references(refs) {
        //     this.updateReferencesFromProps()
        // }
    },
    methods: {
        save() {
            this.$emit('reference-updated', this.currentReferences.split('\n'))
            this.showPopup = false
        },
        closeAndReset() {
            this.showPopup = false
            // reset reference dialog to original value
            this.updateReferencesFromProps()
        },
        handleKeyPresses(e) {
            if(e.key == 'Escape') {
                this.closeAndReset()
            }
            // if you press Ctrl + Enter it'll save your refs and close the dialog
            if(e.key == 'Enter' && e.ctrlKey) {
                this.save()
                this.showPopup = false
            }
        },
        updateReferencesFromProps() {
            this.currentReferences = this.references ? this.references.join('\n') : ''
        }
    }
}
</script>

<style scoped>
.reference-container {
    padding: 2px;
    display: inline-block;
    margin-left: 5px;
    height: 25px;
    width: 25px;
}

.reference-icon {
    cursor: pointer;
    margin-top: 5px;
    width: 100%;
    height: 100%;
    background-image: url('/src/assets/reference-icon.svg');
    opacity: .4;
}

.reference-fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .9;
    z-index: 10;
}

.reference-dialog {
    color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    width: 40%;
    height: 30%;
    background-color: white;
    border-radius: 15px;
    padding: 25px;
    z-index: 11;
}

.ref-overlay-enter-from, 
.ref-overlay-leave-to {
  opacity: 0;
}

.ref-overlay-enter-active {
  transition: opacity .25s linear;
}

.ref-overlay-leave-active {
  transition: opacity .25s linear;
}
</style>