<template>
    <div class="nav-bar">
        <router-link to="/" class="nav-links">
            <div class="logo-text">
                <span class="switch">Switch</span>
                <span class="switch things">Thing</span>
            </div>
        </router-link>
        <div class="nav-links">
            <router-link to="/search" class="nav-link" :class="activeClass('/search')">Search</router-link>
            <router-link to="/leaderboard" class="nav-link" :class="activeClass('/leaderboard')">Leaderboard</router-link>
            <router-link to="/new" v-if="isLoggedIn" class="nav-link" :class="activeClass('/new')">Add Switch</router-link>
            <router-link to="/login" v-if="!isLoggedIn" class="nav-link" :class="activeClass('/login')">Login</router-link>
            <div @click="toggleProfileHover">
                <img v-if="isLoggedIn && avatarUrl" :src="avatarUrl" height="60" class="br-100 pointer" />
                <div v-if="isLoggedIn && !avatarUrl" class="generated-avatar br-100 pointer flex items-center justify-center">{{ avatarLetter }}</div>
                <div class="profile-hover" v-if="showProfileHover">
                    <div v-if="isLoggedIn" @click="logout" class="nav-link pointer">Logout</div>
                </div>
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
.profile-hover {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 200px;
    color: #262335;
    background-color: white;
    margin-left: -70px; /* (200 - 60) / 2 */
    margin-top: 10px;
    padding: 20px;
}

.profile-hover div {
    color: #262335 !important;
}

.logo {
    width: 100px;
}

.generated-avatar {
    color: white;
    font-size: 36px;
    height: 60px;
    width: 60px;
    background-color: lightcoral;
}

.nav-bar {
    display: flex;
    justify-content: space-between;
    padding: 40px;

    .logo-text {
        display: flex;
        gap: 5px;
        padding-left: 50px;

        .switch {
            font-weight: bold;
            font-size: 26px;
            text-decoration: none;
            color: #A387FE;
        }

        .things {
            color: #FFFFFF;
        }
    }

    .nav-links {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 35px;
        padding-right: 50px;


        .nav-link {
            text-decoration: none;
            color: #D2DBED;
            font-size: 20px;
        }

        .active {
            color: #A387FE;
        }
    }
}
</style>