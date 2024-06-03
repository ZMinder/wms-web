<template>
  <el-scrollbar>
    <div>
      <el-input class="StorageNameInput"
                v-model="fuzzy.goodsName"
                placeholder="请输入物品名称"
                :suffix-icon="Search"
                @keyup.enter.native="fuzzyQuery()"></el-input>
      <el-select class="select"
                 v-model="fuzzy.storageName"
                 placeholder="请选择仓库">
        <el-option v-for="(item,index) in storageData"
                   v-bind:key="index"
                   v-bind:label="item.storageName"
                   v-bind:value="item.storageName"/>
      </el-select>
      <el-select class="select"
                 v-model="fuzzy.goodsTypeName"
                 placeholder="请选择分类">
        <el-option v-for="(item,index) in goodsTypeData"
                   v-bind:key="index"
                   v-bind:label="item.goodsTypeName"
                   v-bind:value="item.goodsTypeName"/>
      </el-select>
      <el-select class="select"
                 v-model="fuzzy.recordType"
                 placeholder="请选择分类">
        <el-option label="入库" value="入库"/>
        <el-option label="出库" value="出库"/>
      </el-select>
      <el-button type="primary" @click="fuzzyQuery()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
    </div>
    <el-table :data="recordData.data"
              border
              stripe
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
      <el-table-column prop="recordId" label="ID" width="100px"/>
      <el-table-column prop="goodsName" label="物品名称" width="150px"/>
      <el-table-column prop="storageName" label="所属仓库"/>
      <el-table-column prop="goodsTypeName" label="所属分类"/>
      <el-table-column prop="operatorNickname" label="申请人"/>
      <el-table-column prop="licensorNickname" label="许可人"/>
      <el-table-column prop="recordType" label="操作"/>
      <el-table-column prop="goodsCount" label="物品数量"/>
      <el-table-column prop="operationTime" label="操作时间"/>
      <el-table-column prop="recordRemark" label="备注"/>
    </el-table>
    <!--    分页标签-->
    <el-pagination
        v-model:current-page="recordData.pageNum"
        v-model:page-size="recordData.pageSize"
        :page-sizes="[5, 10, 20,30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 5px"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import axios from "axios"
import {baseURL as base} from "../../store/store";

const baseURL = base().baseURL + "record"

let recordData = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 5,
  data: []
})

let fuzzy = reactive({
  goodsName: null,
  storageName: null,
  goodsTypeName: null,
  recordType: null,
  roleId: null
})

let storageData = ref([])//存储仓库数据

let goodsTypeData = ref([])//存储物品分类数据

async function loadData() {//组件挂载之前从后端获取数据
  await loadStorageData()
  await loadGoodsTypeData()
  loadRecordData()
}

function loadStorageData() {
  let url = base().baseURL + "storage/list"
  let promise = axios.get(url)

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(storageData.value, response.data.data)
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

function loadRecordData() {
  let promise = axios.post(baseURL + "/fuzzy", fuzzy, {
    params: {
      pageSize: recordData.pageSize,
      pageNum: recordData.pageNum,
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(recordData, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

onBeforeMount(() => {
  loadData()
})

function handleSizeChange(val) {//处理每页显示条目数改变的时候
  recordData.pageNum = 1//每页条目数该表的情况下，默认从第一页重新显示
  loadRecordData()
}

function handleCurrentChange(val) {//处理当前页数改变的时候情况
  loadRecordData()
}

function resetPageData() {
  recordData.pageSize = 10
  recordData.pageNum = 1
}

function fuzzyQuery() {
  resetPageData()
  loadRecordData()
}

function resetQuery() {
  //重置查询数据
  Object.assign(fuzzy, {
    goodsName: null,
    storageName: null,
    goodsTypeName: null,
    recordType: null
  })
  //重置分页数据
  resetPageData()
  loadRecordData()
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