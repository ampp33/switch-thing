<template>
    <div class="header flex items-center">
        <router-link to="/search" style="color: black">
            <div class="flex items-center">
                <img src="../../assets/icon.png" class="logo" />
                <span class="title">Switch Thing</span>
            </div>
        </router-link>
        <div class="flex items-center menu">
            <router-link to="/search"><div class="button">Search</div></router-link>
            <router-link to="/new" v-if="isLoggedIn"><div class="button">Add Switch</div></router-link>
            <router-link to="/login" v-if="!isLoggedIn"><div class="button">Login</div></router-link>
            <div v-if="isLoggedIn" @click="logout" class="button light-red">Logout</div>
            <img v-if="isLoggedIn && avatarUrl" :src="avatarUrl" height="60" class="br-100 pointer" />
            <div v-if="isLoggedIn && !avatarUrl" class="generated-avatar br-100 pointer flex items-center justify-center">{{ avatarLetter }}</div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../../stores/auth-store'

export default {
    data() {
        return {

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
            return session.user?.user_metadata?.display_name?.charAt(0).toUpperCase()
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
        }
    }
}
</script>

<style scoped>
.header {
    height: 120px;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px lightcoral solid;
}

.logo {
    width: 100px;
}

.title {
    font-weight: 100;
    font-size: 60px;
    font-style: italic;
}

.menu {
    position: absolute;
    right: 40px;
}

.button {
    font-weight: 400;
    font-size: 20px;
    margin-right: 15px;
    padding: 10px;
    cursor: pointer;
}

.generated-avatar {
    color: white;
    font-size: 36px;
    height: 60px;
    width: 60px;
    background-color: lightcoral;
}
</style>