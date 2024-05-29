<template>
  <el-scrollbar>
    <div>
      <el-input class="nicknameInput" v-model="fuzzy.nickname" placeholder="请输入姓名"
                :suffix-icon="Search" @keyup.enter.native="fuzzyLoad()"></el-input>
      <el-select class="genderSelect" v-model="fuzzy.gender" placeholder="请选择性别">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-button type="primary" @click="fuzzyLoad()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
    </div>
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
        :page-sizes="[5, 10, 20,30]"
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
import {Search} from '@element-plus/icons-vue'
import axios from "axios"

const baseURL = "http://localhost:8090/user"

let userData = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 5,
  data: []
})

let fuzzy = reactive({
  nickname: null,
  gender: null,
  roleId: null
})

let keywords = ref("")//模糊查询的关键字

let gender = ref("")//根据性别查询

function loadData() {//组件挂载之前从后端获取数据
  let promise = axios.get(baseURL, {
    params: {
      pageSize: userData.pageSize,
      pageNum: userData.pageNum,
    }
  })
  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(userData, response.data.data)
      // console.log(userData)
    } else {
      alert("数据获取失败")
    }
  }).catch(error => {
    console.log(error)
  })
}

function fuzzyLoad() {//模糊查询
  let url = baseURL + "/fuzzy"
  let promise = axios.post(url, fuzzy, {
    params: {
      pageSize: userData.pageSize,
      pageNum: userData.pageNum
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(userData, response.data.data)
      console.log(userData)
    }
  }).catch(error => {
    alert(error)
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

function resetQuery() {
  //重置数据
  fuzzy.nickname = null
  fuzzy.gender = null
  fuzzy.roleId = null
  //重置分页数据
  userData.pageNum = 1
  userData.pageSize = 10
  loadData()
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