<template>
    <div>
        <h1>Approvals</h1>
        <div v-if="pendingApprovals">
            <div class="w-100 flex">
                <div class="w-10 b">
                    Switch Name
                </div>
                <div class="w-10 b">
                    Pending Version
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
                <div class="w-15 b">
                    Review
                </div>
            </div>
            <div v-for="(pendingApproval, index) in pendingApprovals" :key="pendingApproval.id">
                <div class="flex">
                    <div class="w-10">
                        <router-link v-if="pendingApproval.event_type == 'N'" :to="`/switch/${pendingApproval.slug}/history/${pendingApproval.version}`">{{ pendingApproval.name }}</router-link>
                        <router-link v-else :to="`/switch/${pendingApproval.slug}`">{{ pendingApproval.name }}</router-link>
                    </div>
                    <div class="w-10">
                        <router-link :to="`/switch/${pendingApproval.slug}/history/${pendingApproval.version}`">{{ pendingApproval.version }} (view)</router-link>
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
                        <button type="button" @click="approve(index)">Approve</button>
                        <button type="button" @click="reject(index)">Reject</button>
                    </div>
                    <div class="w-10">
                        <button @click="pendingApproval.expanded = !pendingApproval.expanded" type="button">Show Diff</button>
                        <button type="button">Preview</button>
                    </div>
                </div>
                <transition name="diff">
                    <div v-if="pendingApproval.expanded" class="overflow-hidden">
                        <div class="ma3">
                            <diff
                                :prev="pendingApproval.leftDataAsString"
                                :current="pendingApproval.rightDataAsString"
                                language="json"
                                :virtual-scroll="{ height: 1000, lineMinHeight: 24, delay: 100 }" />
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'
import { patch } from 'jsondiffpatch'
import { getPendingApprovals, approvePendingApproval, rejectPendingApproval } from '../../../backend'
export default {
    data() {
        return {
            pendingApprovals: []
        }
    },
    computed: {
        ...mapStores(useAuthStore)
    },
    methods: {
        async approve(paIndex) {
            const pa = this.pendingApprovals[paIndex]
            const { error } = await approvePendingApproval(pa.id, JSON.parse(pa.rightDataAsString), this.authStore.getSession.user.id)
            console.log(error)
            // TODO handle errors

            // pending approval has been handled without error, remove it from the list
            if(!error) this.pendingApprovals.splice(paIndex, 1)
        },
        async reject(paIndex) {
            const pa = this.pendingApprovals[paIndex]
            const { error } = await rejectPendingApproval(pa.id)
            console.log(error)
            // TODO handle errors

            // pending approval has been handled without error, remove it from the list
            if(!error) this.pendingApprovals.splice(paIndex, 1)
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

            const switchName = pa.event_type == 'N' ? pa.diff.name : pa.current_switch_data.name

            // build diffs
            let leftData = {}
            let rightData = {}
            if(pa.event_type == 'N') {
                // new switch, leave "left" as an empty string since there's nothing to compare against,
                // and set the right to be the data provided during switch creation
                rightData = pa.diff
            } else {
                leftData = pa.current_switch_data
                const leftDataCopy = JSON.parse(JSON.stringify(leftData))
                rightData = patch(leftDataCopy, pa.diff)
            }

            return {
                ...pa,
                humanReadableChangeType,
                name: switchName,
                expanded: false,
                leftDataAsString: JSON.stringify(leftData, null, 2),
                rightDataAsString: JSON.stringify(rightData, null, 2)
            }
        })
    }
}
</script>

<style scoped>
.w-15 {
    width: 15%;
}

.diff-enter-from,
.diff-leave-to {
    height: 0px;
}

.diff-enter-to,
.diff-leave-from {
    height: 1032px; /* 32 pixes for ma3 margin, which is 16px all around */
}

.diff-enter-active,
.diff-leave-active {
    transition: height .5s ease-in-out;
}
</style>