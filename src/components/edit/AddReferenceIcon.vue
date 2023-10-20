<template>
    <div class="aaa" @keydown.esc="showPopup = false">
        <div @click="showPopup = !showPopup">
            R
        </div>
        <div v-if="showPopup" class="popup">
            <div>References</div>
            <textarea v-model="currentReferences" class="w-100 h-75"></textarea>
            <button type="button" @click="save">OK</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['references'],
    data() {
        return {
            showPopup: false,
            currentReferences: ''
        }
    },
    watch: {
        references(refs) {
            this.currentReferences = refs ? refs.join('\n') : ''
        }
    },
    methods: {
        save() {
            this.$emit('reference-updated', this.currentReferences.split('\n'))
            this.showPopup = false
        }
    }
}
</script>

<style scoped>
.aaa {
    cursor: pointer;
    padding: 2px;
    display: inline-block;
    margin-left: 5px;
    background-color: hotpink;
}

.popup {
    position: absolute;
    /* margin-left: 200px; */
    width: 500px;
    height: 150px;
    background-color: aqua;
    padding: 10px;
    z-index: 10;
}
</style>