<template>
    <div>Successfully signed up!  Check your email to confirm your email address before you can login.</div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    computed: {
        ...mapStores(useAuthStore)
    },
    async mounted() {
        console.log('signup-success')
        // set session in store and redirect to wherever
        // await this.authStore.loadSession()
        // this.$router.push('/')
    }
}
</script>