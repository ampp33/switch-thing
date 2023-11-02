<template>
    <div>
        <h1>Approvals</h1>
        <div v-if="pendingApprovals">
            <div class="w-100 flex">
                <div class="w-10 b">
                    Switch Name
                </div>
                <div class="w-10 b">
                    Version
                </div>
                <div class="w-10 b">
                    Change Type
                </div>
                <div class="w-10 b">
                    User
                </div>
                <div class="w-15 b">
                    Timestamp
                </div>
                <div class="w-10 b">
                    Controls
                </div>
                <div class="w-15 b"></div>
            </div>
            <div v-for="pendingApproval in pendingApprovals" :key="pendingApproval.id">
                <div class="flex">
                    <div class="w-10">
                        {{ pendingApproval.name }}
                    </div>
                    <div class="w-10">
                        {{ pendingApproval.version }}
                    </div>
                    <div class="w-10">
                        {{ pendingApproval.humanReadableChangeType }}
                    </div>
                    <div class="w-10">
                        {{ pendingApproval.update_user }}
                    </div>
                    <div class="w-15">
                        {{ pendingApproval.updated_ts.toLocaleDateString() + ' at ' + pendingApproval.updated_ts.toLocaleTimeString() }}
                    </div>
                    <div class="w-10">
                        <button type="button">Approve</button><button type="button">Reject</button>
                    </div>
                    <div class="w-10">
                        <button @click="pendingApproval.expanded = !pendingApproval.expanded" type="button">Expand</button>
                    </div>
                </div>
                <div v-if="pendingApproval.expanded">
                    Show diff here
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getPendingApprovals } from '../../../backend'
export default {
    data() {
        return {
            pendingApprovals: null
        }
    },
    async mounted() {
        // load initial approvals
        const { data, error } = await getPendingApprovals()
        // TODO handle errors
        this.pendingApprovals = data.map((pa) => {
            let humanReadableChangeType = ''
            if(pa.event_type == 'N') humanReadableChangeType = 'New Switch'
            else if(pa.event_type == 'U') humanReadableChangeType = 'Update'
            else if(pa.event_type == 'D') humanReadableChangeType = 'Delete Switch'
            else humanReadableChangeType = 'Unknown'

            const switchName = pa.event_type == 'N' ? pa.diff.name : pa.name

            return {
                ...pa,
                humanReadableChangeType,
                name: switchName,
                expanded: false
            }
        })
    }
}
</script>

<style scoped>
.w-15 {
    width: 15%;
}
</style>