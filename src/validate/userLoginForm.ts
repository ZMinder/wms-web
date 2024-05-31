import {reactive} from "vue";

let loginForm = reactive({//收集表单数据
    username: null,
    password: null
})

let rules = {
    username: [
        {required: true, message: "请输入账号", trigger: "blur"}
    ],
    password: [
        {required: true, message: "请输入密码", trigger: "blur"}
    ]
}

export {loginForm, rules}