import {reactive} from "vue";
import {baseURL as base} from "../store/store";
import axios from "axios";

let storageForm = reactive({//收集表单数据
    id: null,
    storageName: null,
    storageRemark: null
})

let resetStorage = reactive({//收集表单数据
    id: null,
    storageName: null,
    storageRemark: null
})

let rules = {
    storageName: [
        {validator: validateStorageName, trigger: "blur"}
    ],
    storageRemark: [
        {required: true, message: "请输入备注", trigger: "blur"}
    ]
}

async function validateStorageName(rule, value, callback) {//验证账号
    if (!value) {//未输入账号
        return callback(new Error('请输入仓库名'))
    }
    if (!storageForm.id) {//添加或修改
        try {
            const res = await checkStorageNameExist(value)
            if (res) {
                return callback(new Error("该仓库名已被占用"))
            }
        } catch (error) {
            alert(error)
        }
    }
    return callback()
}

async function checkStorageNameExist(value) {//检查账号是否已被使用
    let baseURL = base().baseURL + "storage"
    let url = baseURL + "/" + value
    try {
        const response = await axios.get(url)
        if (response.data.code == 200) {
            return true
        } else if (response.data.code == 400) {
            return false
        }
    } catch (error) {
        alert(error)
    }
}

export {storageForm, rules, resetStorage}