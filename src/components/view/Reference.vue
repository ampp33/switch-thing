<template>
    <div class="reference-wrapper">
        <div class="reference-icon" v-if="references" @mouseover="showPopup = true" @mouseout="startHideTimeout"></div>
        <div v-if="showPopup" class="reference-hover" @mouseover="endHideTimeout" @mouseout="startHideTimeout">
            References
            <div class="references">
                {{ formattedReferences }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['references'],
    data() {
        return {
            showPopup: false,
            hideTimeout: null
        }
    },
    computed: {
        formattedReferences() {
            return this.references ? this.references.join('\n') : ''
        }
    },
    methods: {
        startHideTimeout() {
            const self = this
            this.hideTimeout = setTimeout(() => {
                self.showPopup = false
            }, 500)
        },
        endHideTimeout() {
            clearTimeout(this.hideTimeout)
        }
    }
}
</script>

<style scoped>
.reference-wrapper {
    display: inline-block;
}

.reference-icon {
    cursor: pointer;
    margin-top: 5px;
    width: 20px;
    height: 20px;
    background-image: url('/src/assets/reference-icon.svg');
    opacity: .25;
    filter: invert(100%)
}

.reference-hover {
    font-size: 20px;
    color: black;
    position: absolute;
    background-color: white;
    padding: 25px;
}

.references {
    font-weight: 400;
    font-size: 18px;
}
</style>