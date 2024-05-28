<template>
  <el-scrollbar>
    <el-table :data="userData.data" border stripe
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
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
        <el-button type="primary" size="default">编辑</el-button>
        <el-button type="danger" size="default">删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="userData.pageNum"
        v-model:page-size="userData.pageSize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 5px"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from 'vue'
import axios from "axios"

const baseURL = "http://localhost:8090/user"

let userData = reactive({
  pageSize: 5,
  pageNum: 1,
  total: 5,
  data: []
})

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: userData.pageSize,
      pageNum: userData.pageNum
    }
  })
  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(userData, response.data.data)
      console.log(userData)
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

function handleSizeChange(val) {//处理每页显示条目数改变的时候
  userData.pageNum = 1//每页条目数该表的情况下，默认从第一页重新显示
  loadData()
}

function handleCurrentChange(val) {//处理当前页数改变的时候情况
  loadData()
}
</script>

<style scoped>
</style>