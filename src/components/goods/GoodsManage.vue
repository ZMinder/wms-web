<template>
  <el-scrollbar>
    <div>
      <el-input class="StorageNameInput"
                v-model="goodsData.fuzzy.goodsName"
                placeholder="请输入物品名称"
                :suffix-icon="Search"
                @keyup.enter.native="fuzzyQuery()"></el-input>
      <el-select class="select"
                 v-model="goodsData.fuzzy.goodsStorage"
                 placeholder="请选择仓库">
        <el-option v-for="(item,index) in storageData"
                   v-bind:key="index"
                   v-bind:label="item.storageName"
                   v-bind:value="item.id"/>
      </el-select>
      <el-select class="select"
                 v-model="goodsData.fuzzy.goodsType"
                 placeholder="请选择分类">
        <el-option v-for="(item,index) in goodsTypeData"
                   v-bind:key="index"
                   v-bind:label="item.goodsTypeName"
                   v-bind:value="item.id"/>
      </el-select>
      <el-button type="primary" @click="fuzzyQuery()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
      <el-button type="primary" @click="saveGoods()">添加物品</el-button>
      <el-button type="primary" @click="importGoods()">入库</el-button>
      <el-button type="primary" @click="exportGoods()">出库</el-button>
    </div>
    <el-table :data="goodsData.data"
              border
              stripe
              highlight-current-row
              @current-change="handleGoodsToRecord"
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
      <el-table-column prop="id" label="ID" width="100px"/>
      <el-table-column prop="goodsName" label="物品名称" width="150px"/>
      <el-table-column prop="goodsStorage" label="所属仓库" width="150px">
        <template v-slot="scope">
          {{ getStorageMsg(scope.row.goodsStorage) }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsType" label="所属分类" width="150px">
        <template v-slot="scope">
          {{ getGoodsTypeMsg(scope.row.goodsType) }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsCount" label="物品数量" width="150px"/>
      <el-table-column prop="goodsRemark" label="备注"/>
      <el-table-column prop="operation" label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="default" @click="modify(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除吗？" @confirm="remove(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="default">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页标签-->
    <el-pagination
        v-model:current-page="goodsData.pageNum"
        v-model:page-size="goodsData.pageSize"
        :page-sizes="[5, 10, 20,30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 5px"
    />
    <!--    对话框标签-->
    <el-dialog v-model="dialogFormVisible"
               title="编辑信息"
               width="500px" @close="resetForm()">
      <el-form v-bind:model="goodsForm"
               ref="form"
               v-bind:rules="rules"
               label-width="80"
               label-position="right"
               @submit.native.prevent>
        <el-form-item prop="goodsName"
                      label="物品名称"
                      style="width: 300px">
          <el-input v-model="goodsForm.goodsName"
                    placeholder="请输入物品名称"/>
        </el-form-item>
        <el-form-item prop="goodsStorage"
                      label="所属仓库"
                      style="width: 300px">
          <el-select v-model="goodsForm.goodsStorage"
                     placeholder="请选择仓库">
            <el-option v-for="(item,index) in storageData"
                       v-bind:key="index"
                       v-bind:label="item.storageName"
                       v-bind:value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsType"
                      label="所属分类"
                      style="width: 300px">
          <el-select v-model="goodsForm.goodsType"
                     placeholder="请选择分类">
            <el-option v-for="(item,index) in goodsTypeData"
                       v-bind:key="index"
                       v-bind:label="item.goodsTypeName"
                       v-bind:value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsCount"
                      label="物品数量"
                      style="width: 300px">
          <el-input v-model="goodsForm.goodsCount"
                    placeholder="请输入物品数量"/>
        </el-form-item>
        <el-form-item prop="goodsRemark"
                      label="备注"
                      style="width: 300px">
          <el-input v-model="goodsForm.goodsRemark"
                    type="textarea"
                    placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="doAddOrModify()">确认</el-button>
      </template>
    </el-dialog>
    <!--    出入库记录对话框-->
    <el-dialog v-model="recordDialogVisible"
               title="出入库"
               width="500px" @close="resetRecordForm()">
      <!--      内嵌一个dialog 用于用户选择-->
      <el-dialog v-model="innerDialogVisible"
                 title="申请人选择"
                 width="75%"
                 append-to-body>
        <UserSelect></UserSelect>
        <template #footer>
          <el-button type="primary" @click="closeInnerDialog()">取消</el-button>
          <el-button type="success" @click="confirmOperator()">确认</el-button>
        </template>
      </el-dialog>
      <el-form v-bind:model="recordForm"
               ref="recordFormRef"
               v-bind:rules="recordRules"
               label-width="80"
               label-position="right"
               @submit.native.prevent>
        <el-form-item prop="goodsId"
                      label="物品名称"
                      style="width: 300px">
          <el-input v-bind:placeholder="goods.goodsName"
          />
        </el-form-item>
        <el-form-item prop="operatorId"
                      label="申请人"
                      style="width: 300px">
          <el-input v-bind:placeholder="operator.nickname"
                    @click="selectOperator"/>
        </el-form-item>
        <el-form-item prop="goodsCount"
                      label="数量"
                      style="width: 300px">
          <el-input v-model="recordForm.goodsCount"
                    placeholder="请输入物品数量"/>
        </el-form-item>
        <el-form-item prop="recordRemark"
                      label="备注"
                      style="width: 300px">
          <el-input v-model="recordForm.recordRemark"
                    type="textarea"
                    placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="recordDialogVisible = false">取消</el-button>
        <el-button type="success" @click="saveRecord()">确认</el-button>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import axios from "axios"
import {ElMessage} from "element-plus";
import {baseURL as base} from "../../store/store";
import {goodsForm, preGoods, resetGoods, rules} from "../../validate/goodsForm";
import {
  closeInnerDialog,
  exportGoods,
  importGoods,
  innerDialogVisible,
  recordDialogVisible,
  recordForm,
  recordFormRef,
  recordRules,
  selectOperator,
  resetRecordForm,
  confirmOperator
} from "../../validate/recordForm";
import {curGoods, realOperator} from "../../store/recordStore";
import UserSelect from "./UserSelect.vue";

const baseURL = base().baseURL + "goods"

let dialogFormVisible = ref(false)//处理对话框是否显示

const form = ref()//绑定form表单

let goodsData = reactive({
  pageSize: 10,
  pageNum: 1,
  fuzzy: {
    goodsName: null,
    goodsStorage: null,
    goodsType: null
  },
  total: 5,
  data: []
})

let storageData = ref([])//存储仓库数据

let goodsTypeData = ref([])//存储物品分类数据

let goods = curGoods()

let operator = realOperator()

async function loadData() {//组件挂载之前从后端获取数据
  await loadStorageData()
  await loadGoodsTypeData()
  loadGoodsData()
}

function loadStorageData() {
  let url = base().baseURL + "storage/list"
  let promise = axios.get(url)

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(storageData.value, response.data.data)
      console.log(storageData.value)
    }
  }).catch(error => {
    alert(error)
  })
}

function loadGoodsTypeData() {
  let url = base().baseURL + "goodsType/list"
  let promise = axios.get(url)

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(goodsTypeData.value, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

function loadGoodsData() {
  let url = baseURL + "/fuzzy"
  let promise = axios.post(url, goodsData.fuzzy, {
    params: {
      pageSize: goodsData.pageSize,
      pageNum: goodsData.pageNum,
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(goodsData, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

onBeforeMount(() => {
  loadData()
})

function handleSizeChange(val) {//处理每页显示条目数改变的时候
  goodsData.pageNum = 1//每页条目数该表的情况下，默认从第一页重新显示
  loadGoodsData()
}

function handleCurrentChange(val) {//处理当前页数改变的时候情况
  loadGoodsData()
}

function resetPageData() {
  goodsData.pageSize = 10
  goodsData.pageNum = 1
}

//table中所属仓库实际显示内容
function getStorageMsg(storageId) {
  for (let storage of storageData.value) {
    if (storage.id == storageId) {
      return storage.storageName
    }
  }
}

//table中所属分类实际显示内容
function getGoodsTypeMsg(typeId) {
  for (let goodsType of goodsTypeData.value) {
    if (goodsType.id == typeId) {
      return goodsType.goodsTypeName
    }
  }
}

function fuzzyQuery() {
  resetPageData()
  loadGoodsData()
}

function resetQuery() {
  //重置查询数据
  Object.assign(goodsData.fuzzy, {
    goodsName: null,
    goodsStorage: null,
    goodsType: null
  })
  //重置分页数据
  resetPageData()
  loadGoodsData()
}

function saveGoods() {//添加仓库
  dialogFormVisible.value = true
}

function modify(row) {
  Object.assign(goodsForm, row)
  preGoods.goodsName = goodsForm.goodsName
  preGoods.goodsStorage = goodsForm.goodsStorage
  preGoods.goodsType = goodsForm.goodsType
  dialogFormVisible.value = true
}

function remove(id) {
  doRemove(id)
}

function doRemove(id) {
  let url = baseURL + "/" + id
  const promise = axios.delete(url)
  promise.then(response => {
    ElMessage.success("删除成功")
    loadData()
  }).catch(error => {
    ElMessage.error("删除失败")
  })
}

//表单相关函数
function doAddOrModify() {
  form.value.validate(valid => {
    if (valid) {
      if (!goodsForm.id) {//id为空是添加
        doSave()
      } else {//修改用户
        doModify()
      }
    } else {
      ElMessage.error("表单数据不合法，请检查")
    }
  })
}

function resetForm() {
  form.value.resetFields()//去除校验
  Object.assign(goodsForm, resetGoods)//赋空值
}

function doSave() {
  //将数据返回给后端
  console.log(baseURL)
  console.log(goodsForm)
  let promise = axios.post(baseURL, goodsForm);
  promise.then(() => {
    dialogFormVisible.value = false//关闭对话框
    ElMessage({
      message: "添加成功",
      type: "success"
    })
    resetPageData()
    loadGoodsData()
  }).catch(error => {
    ElMessage.error("添加失败")
  })
}

function doModify() {
  //将数据返回给后端
  let promise = axios.put(baseURL, goodsForm);
  promise.then(() => {
    dialogFormVisible.value = false//关闭对话框
    ElMessage({
      message: "修改成功",
      type: "success"
    })
    resetPageData()
    loadGoodsData()
  }).catch(error => {
    ElMessage.error("修改失败")
  })
}

//record相关
function handleGoodsToRecord(curRow) {//goods
  goods.id = curRow.id
  goods.goodsName = curRow.goodsName
  goods.goodsCount = curRow.goodsCount
}

function saveRecord() {//保存record
  let url = base().baseURL + "record"
  let user = sessionStorage.getItem("curUser");
  recordForm.goodsId = goods.id
  recordForm.licensorId = user.id
  //operationTime交给后台获取
  let promise = axios.post(url, recordForm)

  promise.then(response => {
    if (response.data.code == 200) {
      console.log(response.data.data)
      ElMessage.success("记录添加成功")
    }
  }).catch(error => {
    alert(error)
  })
}
</script>

<style scoped>
.StorageNameInput {
  margin: 5px;
  width: 200px;
}

.select {
  width: 200px;
  margin: 5px;
}
</style>