import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import Landing from './components/Landing.vue'
import Search from './components/search/Search.vue'
import SwitchView from './components/view/SwitchView.vue'
import SwitchEdit from './components/edit/SwitchEdit.vue'
import Login from './components/auth/Login.vue'
import ForgotPassword from './components/auth/ForgotPassword.vue'
import PasswordReset from './components/auth/PasswordReset.vue'
import SignUp from './components/auth/SignUp.vue'
import SignUpSuccess from './components/auth/SignUpSuccess.vue'
import LoginSuccess from './components/auth/LoginSuccess.vue'
import Profile from './components/profile/Profile.vue'
import NotFound from './components/NotFound.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
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
            component: SwitchEdit
        },
        {
            path: '/edit/:slug',
            name: 'EditSwitch',
            component: SwitchEdit,
            props: true
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

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
