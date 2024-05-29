import axios from "axios";
import {reactive} from "vue";

let baseURL = "http://localhost:8090/user"

let user = reactive({
    id: null,
    preUsername: null,
    username: null,
    nickname: null,
    password: null,
    confirmedPassword: null,
    age: null,
    gender: null,
    phone: null,
    roleId: null
})
let resetUser = reactive({})

Object.assign(resetUser, user)

let userRules = {
    username: [{validator: validateUsername, trigger: "blur"}],
    nickname: [{required: true, message: "请输入姓名", trigger: "blur"}],
    password: [
        {required: true, message: "请输入密码", trigger: "blur"},
        {min: 6, max: 20, message: "密码长度在6到20个字符", trigger: "blur"},
        {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
            message: "密码必须包括大小写字母和数字", trigger: "blur"
        }],
    confirmedPassword: [{validator: validateConfirm, trigger: "blur"}],
    age: [
        {validator: validateAge, trigger: "blur"}
    ],
    gender: [{required: true, message: "请选择性别", trigger: "change"}],
    phone: [
        {required: true, message: "请输入电话", trigger: "blur"},
        {pattern: /^1[3-9]\d{9}$/, message: '请输入有效的电话号码', trigger: 'blur'}],
    roleId: [{required: true, message: "请选择角色", trigger: "change"}]
}

async function validateUsername(rule, value, callback) {//验证账号
    if (!value) {//未输入账号
        return callback(new Error('请输入账号'))
    }
    if (value.length < 3 || value.length > 20) {
        return callback(new Error("账号长度在3到20个字符"))
    }
    if (!user.id || value != user.preUsername) {//添加或修改
        try {
            const res = await checkUsernameExist(value)
            if (res) {
                return callback(new Error("该账号已被占用"))
            }
        } catch (error) {
            alert(error)
        }
    }
    return callback()
}

async function checkUsernameExist(value) {//检查账号是否已被使用
    let url = baseURL + "/" + value
    try {
        const response = await axios.get(url)
        if (response.data.code == 200) {
            console.log("账号已被占用")
            return true
        } else if (response.data.code == 400) {
            console.log("账号未被占用")
            return false
        }
    } catch (error) {
        alert(error)
    }
}

function validateConfirm(rule, value, callback) {//校验两次密码是否一致
    console.log(value)
    if (!value) {
        return callback(new Error("请确认密码"))
    }
    if (value != user.password) {
        return callback(new Error("两次密码不一致"))
    }
    return callback()
}

function validateAge(rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入年龄"))
    }
    if (!(/^\d+$/.test(value))) {//如果不是数字
        return callback(new Error("年龄必须是整数"))
    }
    if (value < 18 || value > 150) {
        return callback(new Error("年龄在18到150之间"))
    }
    return callback()
}

export {
    validateAge, validateConfirm, validateUsername, checkUsernameExist,
    user, userRules, resetUser
}