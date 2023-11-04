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
                        <tcsh
                            :left-text="swtch.type" left-title="Switch Type"
                            :middle-text="(swtch.mount == 'both' ? '3 and 5' : swtch.mount) + '-pin'" middle-title="Mount Type"
                            :right-text="swtch.manufacturer" right-title="Manufacturer"/>
                        <div class="subnote">
                            Created By '{{ createdBy }}',
                            lasted updated {{ updated }} -
                            <router-link :to="`/switch/${slug}/history`">v{{ actualVersion }}{{ isUnapproved ? ' (unapproved)' : '' }}</router-link>
                        </div>
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
import ThreeColorSubHeader from '../ui/ThreeColorSubHeader.vue'
import Reference from './Reference.vue'
import Variant from './Variant.vue'
import { changeSwitchVersion } from '../../../util'
import { getSwitch, getSwitchHistory } from '../../../backend'

export default {
    name: 'SwitchView',
    props: ['slug', 'version'],
    components: {
        'tcsh': ThreeColorSubHeader,
        Reference,
        Variant
    },
    data() {
        return {
            errorMessage: null,
            switchData: null,
            swtch: null,
            actualVersion: null,
            isUnapproved: false
        }
    },
    computed: {
        updated() {
            const updated = this.switchData.updated_ts
            return updated.toLocaleDateString() + ' at ' + updated.toLocaleTimeString()
        },
        createdBy() {
            return this.switchData.create_user || 'system'
        },
        isSpecifiedSwitchVersionNumeric() {
            return this.version && this.version.match(/^\d+$/)
        }
    },
    methods: {
        async loadSwitchData() {
            const { data, error } = await getSwitch(this.slug)
            if(error) {
                if(error.public) this.errorMessage = error.message
                else this.errorMessage = 'An error occurred loading the switch\'s data, please refresh or try again later'
                return
            }
            this.switchData = data
        }
    },
    async mounted() {
        // load switch history, if the verison number is specified
        if(this.isSpecifiedSwitchVersionNumeric) {
            const { data, error } = await getSwitchHistory(this.slug)

            if(error) {
                if(error.public) this.errorMessage = error.message
                else this.errorMessage = 'An error occurred loading the switch\'s historical entries, please refresh or try again later'
                return
            }
            
            const history = data

            // check if the specified version is actually in the list of switch versions,
            // and if it is update the switch's data, otherwise default to the current switch version
            if(history.some(h => h.version == this.version)) {
                await this.loadSwitchData()
                const latestApprovedSwitchVersion = this.switchData?.version || 0
                // if switch exists then use the specified version
                if(this.switchData) this.swtch = changeSwitchVersion(history, this.switchData.data, this.version)
                // switch doesn't exist, so show the specified version that has yet to be created or approved
                else {
                    // TODO make it possible to jump ahead more than one version
                    const historyItem = history[0]
                    this.switchData = {
                        data: historyItem.diff,
                        create_user: historyItem.update_user,
                        updated_ts: historyItem.updated_ts
                    }
                    this.swtch = this.switchData.data
                }
                this.actualVersion = this.version
                if(this.actualVersion > latestApprovedSwitchVersion) this.isUnapproved = true
                return
            }
        }

        // no version number specified, use the current switch data/version
        await this.loadSwitchData()
        if(!this.switchData) {
            // no data means that no switch could not be found, so let the user know
            this.errorMessage = 'Switch not found'
            return
        }
        this.swtch = this.switchData.data
        this.actualVersion = this.switchData.version
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

.subnote {
    color: #504d5c;
    font-size: 18px;
}
</style>