<template>
    <div>
        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div v-if="swtch">
            <div>
                <div class="top-section">
                    <div class="w-40 mr4 mb3 fl">
                        <h1>
                            {{ swtch.name}}
                            <reference :references="swtch.references?.['name']" />
                        </h1>
                        <div class="flex mb2">
                            <div class="w-33 aaa pa2">
                                {{ swtch.type }}
                            </div>
                            <div class="w-33 bbb pa2">
                                {{ swtch.mount == 'both' ? '3 and 5' : swtch.mount }}-pin
                            </div>
                            <div class="w-33 ccc pa2">
                                {{ swtch.manufacturer }}
                            </div>
                        </div>
                        <div class="subnote">Created By '{{ createdBy }}', lasted updated {{ updated }}</div>
                    </div>
                    <div class="">
                        <p v-html="swtch.description"></p>
                    </div>
                </div>
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
    </div>
</template>

<script>
import Reference from './Reference.vue'
import Variant from './Variant.vue'
import { getSwitch } from '../../../backend'

export default {
    name: 'SwitchView',
    props: ['slug'],
    components: {
        Reference,
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

        if(!data) {
            // no errors but no data returned, meaning the switch could not be found
            this.errorMessage = 'Switch not found'
            return
        }

        this.switchData = data
        this.swtch = this.switchData.data
    }
}
</script>

<style>
h1 {
    margin-top: 0px;
    margin-bottom: 0px;
}

p {
    margin-top: 0px;
}

.top-section {
    min-height: 130px;
}

.aaa {
    background-color: #383252;
}

.bbb {
    color: #262335;
    background-color: #A387FE;
}

.ccc {
    color: #262335;
    background-color: #D2DBED;
}

.zzz {
    width: 33%;
}

.subnote {
    color: #504d5c;
    font-size: 18px;
}
</style>