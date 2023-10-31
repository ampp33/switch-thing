<template>
    <div>
        <h1>History</h1>
        <div v-if="history && history.length > 0">
            <table>
                <th>Left</th>
                <th>Right</th>
                <th>Version</th>
                <th>Updated By</th>
                <th>Timestamp</th>
                <tbody>
                    <tr v-for="(historyRow, index) in history">
                        <td class="tc"><input type="radio" v-model="leftVersion" :value="historyRow.version" @change="updateHistoryDiff" /></td>
                        <td class="tc"><input type="radio" v-model="rightVersion" :value="historyRow.version" @change="updateHistoryDiff" /></td>
                        <td>v{{ historyRow.version }}</td>
                        <td>{{ historyRow.update_user }}</td>
                        <td>{{ historyRow.updated_ts.toLocaleDateString() + ' at ' + historyRow.updated_ts.toLocaleTimeString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="leftVersion && rightVersion">
            <div class="pa3" v-if="leftSwitchData && rightSwitchData">
                <div class="flex">
                    <div class="w-50 pa2 tc">History</div>
                    <div class="w-50 pa2 tc">Current</div>
                </div>
                <diff :prev="leftAsString" :current="rightAsString" language="json" />
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
            leftSwitchData: '',
            rightSwitchData: '',
            prevSwitchData: '',
            history: [],
            leftVersion: null,
            rightVersion: null,
        }
    },
    computed: {
        leftAsString() {
            return JSON.stringify(this.leftSwitchData, null, 2)
        },
        rightAsString() {
            return JSON.stringify(this.rightSwitchData, null, 2)
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
            if(!this.leftVersion || !this.rightVersion) return
            const switchDataAsString = JSON.stringify(this.switchData.data)
            let left = JSON.parse(switchDataAsString)
            let right = JSON.parse(switchDataAsString)
            const changeVersion = (switchData, targetVersion) => {
                let prev = switchData
                for(const historyItem of this.history) {
                    if(historyItem.version == targetVersion) break
                    prev = unpatch(prev, historyItem.diff)
                }
                return prev
            }
            this.leftSwitchData = changeVersion(left, this.leftVersion)
            this.rightSwitchData = changeVersion(right, this.rightVersion)
        }
    },
    async mounted() {
        await this.loadSwitch()
        await this.loadSwitchHistory()
        // if there are no history records,
        // then just insert the current switch data
        // so the user at least sees a single "v1" entry
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

<style lang="scss">
.vue-diff-theme-dark {
    background-color: #181722;
}

.vue-diff-viewer .vue-diff-row {
    background-color: #181722;

    .hljs {
    //   background-color: #000;
      color: #fff;
    }
    
    .hljs-tag,
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-strong,
    .hljs-name {
      color: lightcoral;
    }
    
    .hljs-code {
      color: #66d9ef;
    }
    
    .hljs-attribute,
    .hljs-symbol,
    .hljs-regexp,
    .hljs-link {
      color: #bf79db;
    }
    
    .hljs-string,
    .hljs-bullet,
    .hljs-subst,
    .hljs-title,
    .hljs-section,
    .hljs-emphasis,
    .hljs-type,
    .hljs-built_in,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-addition,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #A387FE;
    }
    
    .hljs-title.class_,
    .hljs-class .hljs-title {
      color: white;
    }
    
    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #75715e;
    }
    
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-doctag,
    .hljs-title,
    .hljs-section,
    .hljs-type,
    .hljs-selector-id {
      font-weight: bold;
    }
}
</style>