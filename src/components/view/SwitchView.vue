<template>
    <div v-if="swtch">
        <h1>{{ swtch.name}}</h1>
        <H2>{{ swtch.type }}</H2>
        <h2>{{ swtch.manufacturer }}</h2>
        <p v-html="swtch.description"></p>
        <div><b>Mount:</b> {{ swtch.mount }}-pin</div>
        <h2>Variants</h2>
        <variant v-for="spec in swtch.specs" :key="spec" :spec="spec" />
        <h2>Prices</h2>
        <div v-for="price in swtch.prices" :key="price.url">
            <a :href="price.url">{{ price.url }}</a>
        </div>
        <div>
            <input type="button" value="Edit" @click="gotoEditPage" />
        </div>
    </div>
    <div>Credit: <a href="https://sketchfab.com/3d-models/cherry-mx-switches-71e8e1687abc4a8fbef195ab09581287">3D Switch Author</a></div>
</template>

<script>
import Variant from './Variant.vue'
import { getSwitch } from '../../../backend'

export default {
    name: 'SwitchView',
    props: ['slug'],
    components: {
        Variant
    },
    data() {
        return {
            swtch: null
        }
    },
    methods: {
        gotoEditPage() {
            window.location.href = '/edit/' + this.slug
        }
    },
    async created() {
        this.swtch = await getSwitch(this.slug)
    }
}
</script>

<style>


</style>