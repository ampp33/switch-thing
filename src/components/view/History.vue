<template>
    <div>
        <h1>History</h1>
        <div>
            <table>
                <th>Compare</th>
                <th>Version</th>
                <th>Updated By</th>
                <th>Timestamp</th>
                <tbody>
                    <tr v-for="(historyRow, index) in history">
                        <td><input type="radio" v-model="selectedVersion" :value="historyRow.version" @change="updateHistoryDiff" /></td>
                        <td>{{ historyRow.version }}{{ index == 0 ? ' (current)' : '' }}</td>
                        <td>{{ historyRow.update_user }}</td>
                        <td>{{ historyRow.updated_ts.toLocaleDateString() + ' at ' + historyRow.updated_ts.toLocaleTimeString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedVersion">
            <diff :prev="prevSwitchData ? prevSwitchData : {}" :current="switchData ? switchData : ''" language="json" />
        </div>
    </div>
</template>

<script>
import { unpatch } from "jsondiffpatch"
import { getSwitch, getSwitchHistory } from '../../../backend'
import VueDiff from 'vue-diff'
import 'vue-diff/dist/index.css'

export default {
    props: ['slug'],
    components: {
        'diff': VueDiff
    },
    data() {
        return {
            switchData: null,
            prevSwitchData: '',
            history: [],
            selectedVersion: null
        }
    },
    computed: {
        diff() {
            return this.history.find(h => h.version == this.selectedVersion)
        }
    },
    methods: {
        async loadSwitch() {
            const { data, error } = await getSwitch(this.slug)
            this.switchData = data
        },
        async loadSwitchHistory() {
            const { data, error } = await getSwitchHistory(this.slug)
            this.history = data
        },
        updateHistoryDiff() {
            let prev = this.switchData
            if(this.switchData.version == this.selectedVersion) {
                this.prevSwitchData = prev
                return
            }
            for(const historyItem of this.history) {
                prev = unpatch(prev, historyItem.diff)
                if(historyItem.version == this.selectedVersion) break
            }
            this.prevSwitchData = prev
        }
    },
    async mounted() {
        await this.loadSwitch()
        await this.loadSwitchHistory()
    }
}
</script>

<style scoped>

</style>