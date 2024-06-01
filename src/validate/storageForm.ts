import {reactive} from "vue";

let storageForm = reactive({//收集表单数据
    id:null,
    storageName: null,
    storageRemark: null
})

let resetStorage = reactive({//收集表单数据
    id:null,
    storageName: null,
    storageRemark: null
})

let rules = {
    storageName: [
        {required: true, message: "请输入账号", trigger: "blur"}
    ],
    storageRemark: [
        {required: true, message: "请输入密码", trigger: "blur"}
    ]
}

export {storageForm, rules,resetStorage}