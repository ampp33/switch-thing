<template>
    <div class="reference-container">
        <div class="reference-icon" @click="showPopup = !showPopup"></div>
        <modal :show="showPopup" @on-cancel="closeAndReset" @on-keypress="handleKeyPresses">
            <div class="reference-modal">
                <div class="mb2">References</div>
                <textarea v-model="currentReferences" class="w-100 h-100"></textarea>
                <div>
                    <button type="button" @click="save" class="w3 mt2 mr2">OK</button>
                    <button type="button" @click="closeAndReset" class="w4 mt2">Cancel</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import Modal from '../ui/Modal.vue'
export default {
    components: {
        Modal,
    },
    props: ['references'],
    data() {
        return {
            showPopup: false,
            currentReferences: ''
        }
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
            if(e.key == 'Escape') this.closeAndReset()
            // if you press Ctrl + Enter it'll save your refs and close the dialog
            if(e.key == 'Enter' && e.ctrlKey) {
                this.save()
                this.showPopup = false
            }
        },
        updateReferencesFromProps() {
            this.currentReferences = this.references ? this.references.join('\n') : ''
        }
    },
    mounted() {
        this.updateReferencesFromProps()
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

.reference-modal {
    color: black;
    display: flex;
    flex-direction: column;
    width: 700px;
    height: 500px;
    background-color: white;
    border-radius: 15px;
    padding: 25px;
}
</style>