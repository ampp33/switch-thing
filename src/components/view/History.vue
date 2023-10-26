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
                        <td><input type="radio" v-model="selectedVersion" :value="historyRow.version" /></td>
                        <td>{{ historyRow.version }}{{ index == 0 ? ' (current)' : '' }}</td>
                        <td>{{ historyRow.update_user }}</td>
                        <td>{{ historyRow.updated_ts.toLocaleDateString() + ' at ' + historyRow.updated_ts.toLocaleTimeString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedVersion">
            {{ diff.diff }}
        </div>
    </div>
</template>

<script>
import { getSwitch, getSwitchHistory } from '../../../backend'

export default {
    props: ['slug'],
    data() {
        return {
            switchData: null,
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