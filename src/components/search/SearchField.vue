<template>
    <div>
        <label>{{ label }}</label>:
        <input v-if="type == 'text'" type="text" v-model="value" @input="changed"/>
        <select v-if="type == 'option'" v-model="value" @change="changed">
            <option selected></option>
            <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'SearchField',
    props: {
        label: String,
        type: String,
        options: Array
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        changed() {
            this.$emit('onChange', this.label, this.value)
        },
        reset() {
            this.value = null
            this.changed()
        }
    }
}
</script>

<style>
</style>