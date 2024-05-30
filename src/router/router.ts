import {createRouter, createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Personal from '../components/Personal.vue'

const router = createRouter({
    history: createWebHistory(),
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
            component: Index,
            children: [
                {
                    path: '/personal',
                    component: Personal
                }
            ]
        }
    ]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {//如果是前往登录页面，直接放行
        next()
    } else {//必须验证是否登录，否则禁止放行
        let user = JSON.parse(sessionStorage.getItem("curUser"))//存储在sessionStorage中的是json字符串
        if (user.username != null) {//放行
            next()
        } else {
            next("/login")
        }
    }
})

export default router