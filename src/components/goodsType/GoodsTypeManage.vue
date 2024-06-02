<template>
  <el-scrollbar>
    <div>
      <el-input class="goodsTypeNameInput"
                v-model="goodsTypeData.goodsTypeName"
                placeholder="请输入分类名"
                :suffix-icon="Search"
                @keyup.enter.native="queryByGoodsTypeName()"></el-input>
      <el-button type="primary" @click="queryByGoodsTypeName()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
      <el-button type="primary" @click="saveGoodsType()">添加物品分类</el-button>
    </div>
    <el-table :data="goodsTypeData.data" border stripe
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
      <el-table-column prop="id" label="ID" width="100px"/>
      <el-table-column prop="goodsTypeName" label="分类名" width="150px"/>
      <el-table-column prop="goodsTypeRemark" label="备注"/>
      <el-table-column prop="operation" label="操作">
        <template v-slot="scope">
          <el-button type="primary"
                     size="default"
                     @click="modify(scope.row)">编辑
          </el-button>
          <el-popconfirm title="确认删除吗？"
                         @confirm="remove(scope.row.goodsTypeName)">
            <template #reference>
              <el-button type="danger" size="default">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页标签-->
    <el-pagination
        v-model:current-page="goodsTypeData.pageNum"
        v-model:page-size="goodsTypeData.pageSize"
        :page-sizes="[5, 10, 20,30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsTypeData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 5px"
    />
    {{goodsTypeForm.id }}
    <!--    对话框标签-->
    <el-dialog v-model="dialogFormVisible"
               title="编辑信息"
               width="500px"
               @close="resetForm()">
      <el-form v-bind:model="goodsTypeForm"
               ref="form"
               v-bind:rules="rules"
               label-position="right"
               @submit.native.prevent>
        <el-form-item prop="goodsTypeName" label="分类名"
                      label-width="70" style="width: 300px">
          <el-input v-model="goodsTypeForm.goodsTypeName"
                    v-bind:disabled="disableGoodsTypeNameInput"
                    placeholder="请输入分类名"/>
        </el-form-item>
        <el-form-item prop="goodsTypeRemark"
                      label="备注"
                      label-width="70"
                      style="width: 300px">
          <el-input v-model="goodsTypeForm.goodsTypeRemark"
                    type="textarea"
                    placeholder="请输入备注"/>
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
import {goodsTypeForm, resetGoodsType, rules} from "../../validate/goodsTypeForm";

const baseURL = base().baseURL + "goodsType"

let dialogFormVisible = ref(false)//处理对话框是否显示

const form = ref()//绑定form表单

let disableGoodsTypeNameInput = ref(false)//控制仓库名在编辑时禁止修改

let goodsTypeData = reactive({
  pageSize: 10,
  pageNum: 1,
  goodsTypeName: "",
  total: 5,
  data: []
})

function resetPageData() {
  goodsTypeData.pageSize = 10
  goodsTypeData.pageNum = 1
}

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: goodsTypeData.pageSize,
      pageNum: goodsTypeData.pageNum,
      storageName: goodsTypeData.goodsTypeName
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(goodsTypeData, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

function queryByGoodsTypeName() {
  resetPageData()
  loadData()
}

onBeforeMount(() => {
  loadData()
})

function handleSizeChange(val) {//处理每页显示条目数改变的时候
  goodsTypeData.pageNum = 1//每页条目数该表的情况下，默认从第一页重新显示
  loadData()
}

function handleCurrentChange(val) {//处理当前页数改变的时候情况
  loadData()
}

function resetQuery() {
  //重置数据
  goodsTypeData.goodsTypeName = ""
  //重置分页数据
  resetPageData()
  loadData()
}

function doAddOrModify() {
  form.value.validate(valid => {
    if (valid) {
      if (!goodsTypeForm.id) {//id为空是添加
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
  Object.assign(goodsTypeForm, resetGoodsType)//赋空值
}

function doSave() {
  //将数据返回给后端
  let promise = axios.post(baseURL, goodsTypeForm);
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
  let promise = axios.put(baseURL, goodsTypeForm);
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
  Object.assign(goodsTypeForm, row)
  disableGoodsTypeNameInput.value = true
  dialogFormVisible.value = true
}

function remove(goodsTypeName) {
  doRemove(goodsTypeName)
}

function doRemove(goodsTypeName) {
  let url = baseURL + "/" + goodsTypeName
  const promise = axios.delete(url)
  promise.then(response => {
    ElMessage.success("删除成功")
    loadData()
  }).catch(error => {
    ElMessage.error("删除失败")
  })
}

function saveGoodsType() {//添加物品分类
  dialogFormVisible.value = true
  disableGoodsTypeNameInput.value = false
}
</script>

<style scoped>
.goodsTypeNameInput {
  margin: 5px;
  width: 200px;
}

</style>