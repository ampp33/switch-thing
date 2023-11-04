<template>
    <div>
        <h1>Approvals ({{ numAllPendingApprovals != null ? numAllPendingApprovals : '?' }})</h1>
        <!-- <tcsh
            :left-text="swtch.type" left-title="Switch Type"
            :middle-text="(swtch.mount == 'both' ? '3 and 5' : swtch.mount) + '-pin'" middle-title="Mount Type"
            :right-text="swtch.manufacturer" right-title="Manufacturer"/> -->
        <div v-if="pendingApprovals">
            <div class="header">
                <div class="w-15 b">
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
                <div class="w-20 b">
                    Review
                </div>
            </div>
            <div v-for="(pendingApproval, index) in pendingApprovals" :key="pendingApproval.id">
                <div class="row">
                    <div class="w-15 flex items-center">
                        <router-link v-if="pendingApproval.event_type == 'N'" :to="`/switch/${pendingApproval.slug}/history/${pendingApproval.version}`">{{ pendingApproval.name }}</router-link>
                        <router-link v-else :to="`/switch/${pendingApproval.slug}`">{{ pendingApproval.name }}</router-link>
                    </div>
                    <div class="w-10 flex items-center">
                        <router-link :to="`/switch/${pendingApproval.slug}/history/${pendingApproval.version}`">{{ pendingApproval.version }} (view)</router-link>
                    </div>
                    <div class="w-10 flex items-center">
                        {{ pendingApproval.humanReadableChangeType }}
                    </div>
                    <div class="w-10 flex items-center">
                        {{ pendingApproval.update_user }}
                    </div>
                    <div class="w-15 flex items-center">
                        {{ pendingApproval.updated_ts.toLocaleDateString() + ' at ' + pendingApproval.updated_ts.toLocaleTimeString() }}
                    </div>
                    <div class="w-10 flex items-center">
                        <div @click="approve(index)" class="check" title="Approve" />
                        <div @click="reject(index)" class="cross" title="Reject" />
                    </div>
                    <div class="w-20 flex items-center">
                        <button @click="pendingApproval.expanded = !pendingApproval.expanded" type="button">Show Diff</button>
                        <button type="button">Preview</button>
                    </div>
                </div>
                <transition name="error">
                    <div v-if="pendingApproval.errorMessage" class="overflow-hidden">
                        <div class="error">
                            {{ pendingApproval.errorMessage }}
                        </div>
                    </div>
                </transition>
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
import { getNumAllPendingApprovals, getPendingApprovals, approvePendingApproval, rejectPendingApproval } from '../../../backend'
import { getUiErrorMessage } from '../../../util'
import ThreeColorSubHeader from '../ui/ThreeColorSubHeader.vue'
export default {
    components: {
        'tcsh': ThreeColorSubHeader
    },
    data() {
        return {
            numAllPendingApprovals: null,
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
            pa.errorMessage = getUiErrorMessage(error)

            // pending approval has been handled without error, remove it from the list
            if(!pa.errorMessage) this.pendingApprovals.splice(paIndex, 1)
        },
        async reject(paIndex) {
            const pa = this.pendingApprovals[paIndex]
            const { error } = await rejectPendingApproval(pa.id, this.authStore.getSession.user.id)
            pa.errorMessage = getUiErrorMessage(error)

            // pending approval has been handled without error, remove it from the list
            if(!pa.errorMessage) this.pendingApprovals.splice(paIndex, 1)
        }
    },
    async mounted() {
        // load initial approvals
        const { data: count } = await getNumAllPendingApprovals()
        this.numAllPendingApprovals = count
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
.header, .row {
    padding: 10px;
    /* color: #262335; */
    /* background-color: white; */
    display: flex;
    width: 100%;
}

.check, .cross {
    display: inline-block;
    padding: 0px;
    margin: 0px;
    cursor: pointer;
    width: 35px;
    height: 35px;
}

.check {
    background-image: url('/src/assets/check-mark.svg');
    filter: invert(34%) sepia(82%) saturate(507%) hue-rotate(71deg) brightness(104%) contrast(88%);
}

.cross {
    background-image: url('/src/assets/cross.svg');
    filter: invert(13%) sepia(95%) saturate(7478%) hue-rotate(1deg) brightness(97%) contrast(110%);
}

.error {
    font-size: 20px;
    padding: 10px;
    color: black;
    background-color: lightcoral;
}

.w-15 {
    width: 15%;
}

.diff-enter-from,
.diff-leave-to,
.error-enter-from,
.error-leave-to {
    height: 0px;
}

.diff-enter-to,
.diff-leave-from {
    height: 1032px; /* 32 pixes for ma3 margin, which is 16px all around */
}

.error-enter-to,
.error-leave-from {
    height: 40px; /* 32 pixes for ma3 margin, which is 16px all around */
}


.diff-enter-active,
.diff-leave-active,
.error-enter-active,
.error-leave-active {
    transition: height .5s ease-in-out;
}
</style>