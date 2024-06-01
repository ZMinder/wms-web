<template>
  <el-scrollbar>
    <div>
      <el-input class="nicknameInput" v-model="storageData.storageName" placeholder="请输入仓库名"
                :suffix-icon="Search" @keyup.enter.native="queryByStorageName()"></el-input>
      <el-button type="primary" @click="queryByStorageName()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
      <el-button type="primary" @click="saveStorage()">添加仓库</el-button>
    </div>
    <el-table :data="storageData.data" border stripe
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
      <el-table-column prop="id" label="ID" width="100px"/>
      <el-table-column prop="storageName" label="仓库名" width="150px"/>
      <el-table-column prop="storageRemark" label="备注"/>
      <el-table-column prop="operation" label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="default" @click="modify(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除吗？" @confirm="remove(scope.row.storageName)">
            <template #reference>
              <el-button type="danger" size="default">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页标签-->
    <el-pagination
        v-model:current-page="storageData.pageNum"
        v-model:page-size="storageData.pageSize"
        :page-sizes="[5, 10, 20,30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="storageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 5px"
    />
    <!--    对话框标签-->
    <el-dialog v-model="dialogFormVisible" title="编辑信息"
               width="500px" @close="resetForm()">
      <el-form v-bind:model="storageForm" ref="form" v-bind:rules="rules"
               label-position="right">
        <el-form-item prop="storageName" label="仓库名"
                      label-width="70" style="width: 300px">
          <el-input v-model="storageForm.storageName" v-bind:disabled="disableStorageNameInput"
                    placeholder="请输入仓库名"/>
        </el-form-item>
        <el-form-item prop="storageRemark" label="备注"
                      label-width="70" style="width: 300px">
          <el-input v-model="storageForm.storageRemark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="doAddOrModify()">确认</el-button>
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
import {resetStorage, rules, storageForm} from "../../validate/storageForm";

const baseURL = base().baseURL + "storage"

let dialogFormVisible = ref(false)//处理对话框是否显示

const form = ref()//绑定form表单

let disableStorageNameInput = ref()//控制仓库名在编辑时禁止修改

let storageData = reactive({
  pageSize: 10,
  pageNum: 1,
  storageName: "",
  total: 5,
  data: []
})

function resetPageData() {
  storageData.pageSize = 10
  storageData.pageNum = 1
}

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: storageData.pageSize,
      pageNum: storageData.pageNum,
      storageName: storageData.storageName
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(storageData, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

function queryByStorageName() {
  resetPageData()
  loadData()
}

onBeforeMount(() => {
  loadData()
})

function handleSizeChange(val) {//处理每页显示条目数改变的时候
  storageData.pageNum = 1//每页条目数该表的情况下，默认从第一页重新显示
  loadData()
}

function handleCurrentChange(val) {//处理当前页数改变的时候情况
  loadData()
}

function resetQuery() {
  //重置数据
  storageData.storageName = ""
  //重置分页数据
  resetPageData()
  loadData()
}

function doAddOrModify() {
  form.value.validate(valid => {
    if (valid) {
      if (!storageForm.id) {//id为空是添加
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
  Object.assign(storageForm, resetStorage)//赋空值
}

function doSave() {
  //将数据返回给后端
  let promise = axios.post(baseURL, storageForm);
  promise.then(() => {
    dialogFormVisible.value = false//关闭对话框
    ElMessage({
      message: "添加成功",
      type: "success"
    })
    resetPageData()
    loadData()
  }).catch(error => {
    ElMessage.error("添加失败")
  })
}

function doModify() {
  //将数据返回给后端
  let promise = axios.put(baseURL, storageForm);
  promise.then(() => {
    dialogFormVisible.value = false//关闭对话框
    ElMessage({
      message: "修改成功",
      type: "success"
    })
    resetPageData()
    loadData()
  }).catch(error => {
    ElMessage.error("修改失败")
  })
}

function modify(row) {
  Object.assign(storageForm, row)
  disableStorageNameInput = true
  dialogFormVisible.value = true
}

function remove(storageName) {
  doRemove(storageName)
}

function doRemove(storageName) {
  let url = baseURL + "/" + storageName
  const promise = axios.delete(url)
  promise.then(response => {
    ElMessage.success("删除成功")
    loadData()
  }).catch(error => {
    ElMessage.error("删除失败")
  })
}

function saveStorage() {//添加用户
  dialogFormVisible.value = true
  disableStorageNameInput = false
}
</script>

<style scoped>
.nicknameInput {
  margin: 5px;
  width: 200px;
}

.genderSelect {
  width: 200px;
  margin: 5px;
}
</style>