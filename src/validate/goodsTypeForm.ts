import {reactive} from "vue";
import {baseURL as base} from "../store/store";
import axios from "axios";

let goodsTypeForm = reactive({//收集表单数据
    id: null,
    goodsTypeName: null,
    goodsTypeRemark: null
})

let resetGoodsType = reactive({//收集表单数据
    id: null,
    goodsTypeName: null,
    goodsTypeRemark: null
})

let rules = {
    goodsTypeName: [
        {validator: validateGoodsTypeName, trigger: "blur"}
    ],
    goodsTypeRemark: [
        {required: true, message: "请输入备注", trigger: "blur"}
    ]
}

async function validateGoodsTypeName(rule, value, callback) {//验证账号
    if (!value) {//未输入账号
        return callback(new Error('请输入分类名'))
    }
    if (!goodsTypeForm.id) {//添加或修改
        try {
            const res = await checkGoodsTypeNameExist(value)
            if (res) {
                return callback(new Error("该分类名已被占用"))
            }
        } catch (error) {
            alert(error)
        }
    }
    return callback()
}

async function checkGoodsTypeNameExist(value) {//检查账号是否已被使用
    let baseURL = base().baseURL + "goodsType"
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

export {goodsTypeForm, rules, resetGoodsType}