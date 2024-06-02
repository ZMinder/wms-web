import {reactive} from "vue";
import {curGoods} from "../store/recordStore";

let recordForm = reactive({//收集表单数据
    goodsId: null,
    operatorId: null,
    licensorId: null,
    recordType: null,
    goodsCount: null,
    operationTime: null,
    recordRemark: null
})

let resetRecord = reactive({//收集表单数据
    goodsId: null,
    operatorId: null,
    licensorId: null,
    recordType: null,
    goodsCount: null,
    operationTime: null,
    recordRemark: null
})

let recordRules = {
    operatorId: [
        {required: true, message: "请选择申请人", trigger: "blur"}
    ],
    recordType: [
        {required: true, message: "请选择出库/入库", trigger: "blur"}
    ],
    goodsCount: [
        {validator: validateGoodsCount, trigger: "blur"}
    ],
    recordRemark: [
        {required: true, message: "请输入备注", trigger: "blur"}
    ]
}

async function validateGoodsCount(rule, value, callback) {//验证账号
    if (!value) {//未输入出入库数量
        return callback(new Error('请输入出库/入库数量'))
    }
    if (!recordForm.recordType) {
        return callback(new Error('请优先选择入库/出库'))
    }
    if (recordForm.recordRemark == '出库') {
        if (curGoods < value) {//出库数量大于当前物品数量
            callback(new Error('出库数量不得超过当前物品数量'))
        }
    }
    return callback()
}

export {recordForm, resetRecord, recordRules}