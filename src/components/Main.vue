<template>
  <el-scrollbar>
    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" width="140"/>
      <el-table-column prop="name" label="Name" width="120"/>
      <el-table-column prop="address" label="Address"/>
    </el-table>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {ref, onBeforeMount} from 'vue'
import axios from "axios"

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const baseURL = "http://localhost:8090/user"

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: 10,
      pageNum: 1
    }
  })
  promise.then(response => {
    console.log(response.data)
  }).catch(error => {
    console.log(error)
  })
}

onBeforeMount(() => {
  loadData()
})


const tableData = ref(Array.from({length: 10}).fill(item))
</script>

<style scoped>

</style>