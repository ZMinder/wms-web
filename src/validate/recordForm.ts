import {reactive, ref} from "vue";
import {curGoods, curOperator, realOperator} from "../store/recordStore";
import {ElMessage} from "element-plus";

let recordDialogVisible = ref()

let innerDialogVisible = ref()

let recordFormRef = ref()

let goods = curGoods()

let unDetermined = curOperator()

let operator = realOperator()

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
    if (recordForm.recordType == '出库') {
        if (goods.goodsCount < value) {//出库数量大于当前物品数量
            callback(new Error('出库数量不得超过当前物品数量'))
        }
    }
    return callback()
}

function importGoods() {
    if (goods.id == null) {
        ElMessage.error("请选择物品")
    } else {
        recordDialogVisible.value = true
        recordForm.recordType = '入库'
    }
}

function exportGoods() {
    if (goods.id == null) {
        ElMessage.error("请选择物品")
    } else {
        recordDialogVisible.value = true
        recordForm.recordType = '出库'
    }
}

function selectOperator() {
    innerDialogVisible.value = true
}

function closeInnerDialog() {
    innerDialogVisible.value = false
}

function confirmOperator() {
    operator.id = unDetermined.id
    operator.nickname = unDetermined.nickname
    closeInnerDialog()
}

function resetRecordForm() {
    recordFormRef.value.resetFields()
    Object.assign(recordForm, resetRecord)
    //清除curGoods和curOperator
    goods.id = null
    goods.goodsName = null
    operator.id = null
    operator.nickname = null
    Object.assign(unDetermined, operator)
}

export {
    recordForm, resetRecord, recordRules, innerDialogVisible,
    recordFormRef, recordDialogVisible, resetRecordForm,
    importGoods, exportGoods, selectOperator, closeInnerDialog,
    confirmOperator
}