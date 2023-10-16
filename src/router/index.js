import { createWebHistory, createRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth-store'

import ColorSearch from '../components/search/ColorSearch.vue'
import Landing from '../components/Landing.vue'
import Search from '../components/search/Search.vue'
import SwitchView from '../components/view/SwitchView.vue'
import SwitchEdit from '../components/edit/SwitchEdit.vue'
import Login from '../components/auth/Login.vue'
import ForgotPassword from '../components/auth/ForgotPassword.vue'
import PasswordReset from '../components/auth/PasswordReset.vue'
import SignUp from '../components/auth/SignUp.vue'
import SignUpSuccess from '../components/auth/SignUpSuccess.vue'
import LoginSuccess from '../components/auth/LoginSuccess.vue'
import Profile from '../components/profile/Profile.vue'
import NotFound from '../components/NotFound.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/color-search',
            name: 'ColorSearch',
            component: ColorSearch
        },
        {
            path: '',
            name: 'Landing',
            component: Landing
        },
        {
            path: '/switch/:slug',
            name: 'Switch',
            component: SwitchView,
            props: true
        },
        {
            path: '/search',
            name: 'Search',
            component: Search
        },
        {
            path: '/new',
            name: 'NewSwitch',
            component: SwitchEdit,
            meta: { authRequired: true }
        },
        {
            path: '/edit/:slug',
            name: 'EditSwitch',
            component: SwitchEdit,
            props: true,
            meta: { authRequired: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/forgot-password',
            name: 'ForgotPassword',
            component: ForgotPassword
        },
        {
            path: '/password-reset',
            name: 'PasswordReset',
            component: PasswordReset
        },
        {
            path: '/signup',
            name: 'SignUp',
            component: SignUp
        },
        {
            path: '/signup-success',
            name: 'SignUpSuccess',
            component: SignUpSuccess
        },
        {
            path: '/login-success',
            name: 'LoginSuccess',
            component: LoginSuccess
        },
        {
            path: '/profile/:identifier',
            name: 'Profile',
            component: Profile,
            props: true
        },
        {
            path: '/:notFound(.*)',
            name: 'NotFound',
            component: NotFound
        }
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore()
    // if the requested page requires the user to be authenticated but they aren't logged in
    // then redirect them to the login page
    if(to.meta.authRequired && !authStore.isLoggedIn) {
        return {
            name: 'Login'
        }
    }
    // if the session is expired, auto logout the user
    // NOTE: expires_at is in seconds, while new Date().getTime() is ms
    if(authStore.isLoggedIn
            && authStore.getSession
            && authStore.getSession.expires_at <= (new Date().getTime() / 1000)) {
        authStore.logout()
    }
})

export {
    router
}