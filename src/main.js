import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'

import Search from './components/Search.vue'
import SwitchView from './components/SwitchView.vue'
import SwitchEdit from './components/SwitchEdit.vue'
import View3D from './components/3DView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/switch/:slug',
            name: 'Switch',
            component: SwitchView,
            props: true
        },
        {
            path: '/search',
            alias: ['/'],
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
            path: '/3d',
            name: '3DView',
            component: View3D,
            props: true
        }
    ],
});

createApp(App).use(router).mount('#app')
