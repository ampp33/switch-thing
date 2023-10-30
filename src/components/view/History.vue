<template>
    <div>
        <h1>History</h1>
        <div v-if="history && history.length > 0">
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
            <!-- <div class="flex">
                <div class="w-50">
                    <span style="white-space: pre-wrap; font-family: monospace;">{{ JSON.stringify(switchData.data, null, 2) }}</span>
                </div>
                <div class="w-50">
                    <span style="white-space: pre-wrap; font-family: monospace;">{{ JSON.stringify(prevSwitchData, null, 2) }}</span>
                </div>
            </div> -->
            <div class="pa3" v-if="prevSwitchData && switchData && switchData.data">
                <div class="flex">
                    <div class="w-50 pa2 tc">History</div>
                    <div class="w-50 pa2 tc">Current</div>
                </div>
                <diff :prev="prevAsString" :current="currentAsString" language="json" />
            </div>
        </div>
    </div>
</template>

<script>
import { unpatch } from "jsondiffpatch"
import { getSwitch, getSwitchHistory } from '../../../backend'

export default {
    props: ['slug'],
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
        },
        prevAsString() {
            return JSON.stringify(this.prevSwitchData, null, 2)
        },
        currentAsString() {
            return JSON.stringify(this.switchData.data, null, 2)
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
            let prev = JSON.parse(JSON.stringify(this.switchData.data))
            if(this.switchData.version == this.selectedVersion) {
                this.prevSwitchData = prev
                return
            }
            for(const historyItem of this.history) {
                if(historyItem.version == this.selectedVersion) break
                prev = unpatch(prev, historyItem.diff)
            }
            this.prevSwitchData = prev
        }
    },
    async mounted() {
        await this.loadSwitch()
        await this.loadSwitchHistory()
        // no history records, so just insert the current switch data to indicate that there is no history
        if(this.history.length == 0) {
            this.history.push({
                version: 1,
                updated_ts : new Date(this.switchData.updated_ts),
                diff: this.switchData.data,
                event_type: 'N',
                update_user: this.switchData.update_user ? this.switchData.update_user : 'system'
            })
        }
    }
}
</script>

<style scoped>

</style>