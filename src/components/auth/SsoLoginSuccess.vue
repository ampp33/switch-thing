<template>
    <div>Login Success!  Redirecting...</div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    computed: {
        ...mapStores(useAuthStore)
    },
    async mounted() {
        // set session in store and redirect to wherever
        await this.authStore.loadSession()
        this.$router.push('/')
    }
}
</script>