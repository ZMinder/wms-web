import {reactive} from "vue";
import {baseURL as base} from "../store/store";
import axios from "axios";

let goodsForm = reactive({//收集表单数据
    id: null,
    goodsName: null,
    goodsStorage: null,
    goodsType: null,
    goodsCount: null,
    goodsRemark: null
})

let preGoods = reactive({
    goodsName: null,
    goodsStorage: null,
    goodsType: null
})

let resetGoods = reactive({//收集表单数据
    id: null,
    goodsName: null,
    goodsStorage: null,
    goodsType: null,
    goodsCount: null,
    goodsRemark: null
})

let rules = {
    goodsName: [
        {required: true, message: "请输入物品名称", trigger: "blur"}
    ],
    goodsStorage: [
        {required: true, message: "请选择物品所属仓库", trigger: "blur"}
    ],
    goodsType: [
        {validator: validateGoodsNameAndStorageAndType, trigger: "blur"}
    ],
    goodsTypeRemark: [
        {required: true, message: "请输入备注", trigger: "blur"}
    ]
}

async function validateGoodsNameAndStorageAndType(rule, value, callback) {//验证账号
    if (!value) {//未选择分类
        return callback(new Error('请选择物品所属分类'))
    }
    if (!goodsForm.goodsName || !goodsForm.goodsStorage) {
        return callback(new Error('请填写物品名称和所属仓库'))
    }
    //无论添加或修改都要检查 三者不能同时相同
    try {
        if (!goodsForm.id || preGoods.goodsName != goodsForm.goodsName ||
            preGoods.goodsStorage != goodsForm.goodsStorage ||
            preGoods.goodsType != goodsForm.goodsType) {//新增或者修改了名称或仓库或分类
            const res = await checkGoodsNameAndStorageAndType(value)
            if (res) {
                return callback(new Error("当前仓库分类下已存在该物品"))
            }
        }
    } catch (error) {
        alert(error)
    }

    return callback()
}

async function checkGoodsNameAndStorageAndType(value) {//检查三者是否同时相同
    let baseURL = base().baseURL + "goods"
    try {
        const response = await axios.get(baseURL, {
            params: {
                goodsName: goodsForm.goodsName,
                storageId: goodsForm.goodsStorage,
                typeId: value
            }
        })
        if (response.data.code == 200) {
            return true
        } else if (response.data.code == 400) {
            return false
        }
    } catch (error) {
        alert(error)
    }
}

export {goodsForm, rules, resetGoods,preGoods}