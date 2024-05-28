<template>
  <el-scrollbar>
    <el-table :data="tableData" border stripe
              :header-cell-style="{background:'#fafafa',textAlign:'center'}">
      <el-table-column prop="id" label="ID" width="100px"/>
      <el-table-column prop="username" label="账号" width="150px"/>
      <el-table-column prop="nickname" label="姓名"/>
      <el-table-column prop="roleId" label="角色">
        <template v-slot="scope">
          <el-tag v-bind:type="getRoleType(scope.row.roleId)" size="large">
            {{ getRoleMsg(scope.row.roleId) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100px">
        <template v-slot="scope">
          <el-tag v-bind:type="getGenderType(scope.row.gender)" size="large">
            {{ scope.row.gender }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="operation" label="操作">
        <el-tag type="primary" size="large">编辑</el-tag>
        <el-tag type="danger" size="large">删除</el-tag>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from 'vue'
import axios from "axios"

const baseURL = "http://localhost:8090/user"

let tableData = ref([])

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: 10,
      pageNum: 1
    }
  })
  promise.then(response => {
    if (response.data.code == 200) {
      tableData.value = response.data.data.data
      console.log(tableData)

    } else {
      alert("数据获取失败")
    }
  }).catch(error => {
    console.log(error)
  })
}

onBeforeMount(() => {
  loadData()
})


function getRoleType(roleId) {//获取角色tag标签的type
  switch (roleId) {
    case 0:
      return "danger"
    case 1:
      return "primary"
    case 2:
      return "success"
  }
}

function getRoleMsg(roleId) {//获取角色tag标签的替换值
  switch (roleId) {
    case 0:
      return "超级管理员"
    case 1:
      return "管理员"
    case 2:
      return "普通用户"
  }
}

function getGenderType(gender) {//获取角色tag标签的type
  switch (gender) {
    case "男":
      return "primary"
    case "女":
      return "warning"
  }
}

</script>

<style scoped>
</style>