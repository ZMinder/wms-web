import {defineStore} from 'pinia'

const asideCollapse = defineStore({
    id: "collapse", state: () => {
        return {
            isCollapse: false, isCollapseTransition: false, asideWidth: "200px"
        }
    }, getters: {
        getIsCollapse() {
            return this.isCollapse;
        }, getIsCollapseTransition() {
            return this.isCollapseTransition;
        }, getAsideWidth() {
            return this.asideWidth;
        }
    }, actions: {
        collapse() {//折叠侧边栏
            this.isCollapse = true;
            this.asideWidth = "64px"
        }, cancelCollapse() {//取消折叠
            this.isCollapse = false;
            this.asideWidth = "200px"
        }, activeTransition() {//开启折叠动画
            this.isCollapseTransition = true;
        }, cancelTransition() {//取消折叠动画
            this.isCollapseTransition = false;
        }
    }
})

const curUser = defineStore({
    id: "curUser",
    state: () => {
        return {
            id: null, username: null, nickname: null, age: null, gender: null, phone: null, roleId: null, isValid: null
        }
    }
})

export {asideCollapse, curUser}