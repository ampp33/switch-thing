<template>
    <div class="flex justify-center w-100 pa4 footer">
        <div class="flex-column tc mr5">
            <div class="pa2">
                About
            </div>
            <div class="pa2">
                Contact Us
            </div>
            <div class="pa2">
                Discord
            </div>
            <div class="pa2">
                Found An Issue?
            </div>
        </div>
        <div class="flex-column tc">
            <div class="pa2">
                About
            </div>
            <div class="pa2">
                Contact Us
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    data() {
        return {
            showProfileHover: false
        }
    },
    computed: {
        ...mapStores(useAuthStore),
        avatarUrl() {
            const session = this.authStore.getSession
            return session.user?.user_metadata?.avatar_url
        },
        avatarLetter() {
            const session = this.authStore.getSession
            return session.user?.user_metadata?.username?.charAt(0).toUpperCase()
                        || session.user?.email?.charAt(0).toUpperCase()
                        || '?'
        },
        isLoggedIn() {
            return this.authStore.isLoggedIn
        }
    },
    methods: {
        logout() {
            this.authStore.logout()
        },
        activeClass(url) {
            return { 'active' : this.$route.path.startsWith(url)}
        },
        toggleProfileHover() {
            this.showProfileHover = !this.showProfileHover
        }
    }
}
</script>

<style scoped>
.footer {
    position: absolute;
    /* background-color: #A387FE; */
    background-color: #383252;
    bottom: 0;
}
</style>