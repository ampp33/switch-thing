<template>
    <div v-if="swtch">
        <div>
            <h1>{{ swtch.name}}</h1>
            <div class="subnote">Created By '{{ createdBy }}', lasted updated {{ updated }}</div>
            <h2>{{ swtch.type }}</h2>
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
                <router-link :to="'/edit/' + slug"><input type="button" value="Edit" class="ma3" /></router-link>
            </div>
        </div>
        <div>
            Credits:
            <div>3D switch model created by <a href="https://sketchfab.com/3d-models/cherry-mx-switches-71e8e1687abc4a8fbef195ab09581287">BlackCube</a></div>
        </div>
    </div>
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
            errorMessage: null,
            switchData: null,
            swtch: null
        }
    },
    computed: {
        updated() {
            const updated = this.switchData.updated_ts
            return updated.toLocaleDateString() + ' at ' + updated.toLocaleTimeString()
        },
        createdBy() {
            return this.switchData.create_user || 'system'
        }
    },
    async created() {
        const { data, error } = await getSwitch(this.slug)
        if(error) {
            if(error.public) this.errorMessage = error.message
            else this.errorMessage = 'An error occurred loading the switch\'s data, please refresh or try again later'
            return
        }

        this.switchData = data
        this.swtch = this.switchData.data
    }
}
</script>

<style>
h1 {
    margin-bottom: 0px;
}

.subnote {
    color: #504d5c;
    font-size: 18px;
}
</style>