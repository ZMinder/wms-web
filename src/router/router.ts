import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import {curUser} from '../store/store.js'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: Index
        }
    ]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {//如果是前往登录页面，直接放行
        next()
    } else {//必须验证是否登录，否则禁止放行
        let user = curUser()
        if (user.username != null) {//放行
            next()
        } else {
            next("/login")
        }
    }
})

export default router