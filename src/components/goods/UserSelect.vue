<template>
  <el-scrollbar>
    <div>
      <el-input class="goodsTypeNameInput"
                v-model="fuzzy.nickname"
                placeholder="请输入姓名"
                :suffix-icon="Search"
                @keyup.enter.native="fuzzyLoad()">
      </el-input>
      <el-select class="genderSelect" v-model="fuzzy.gender" placeholder="请选择性别">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-button type="primary" @click="fuzzyLoad()">查询</el-button>
      <el-button type="success" @click="resetQuery()">重置</el-button>
    </div>
    <el-table :data="userData.data"
              border
              stripe
              ref="userSelectTable"
              highlight-current-row
              @current-change="selectOperator"
              :header-cell-style="{background:'#fafafa',textAlign:'center'}"
              :cell-style="{textAlign:'center'}">
      <el-table-column prop="id" label="ID" width="100px"/>
      <el-table-column prop="username" label="账号" width="150px"/>
      <el-table-column prop="nickname" label="姓名"/>
      <el-table-column prop="age" label="年龄" width="100px"/>
      <el-table-column prop="gender" label="性别" width="100px">
        <template v-slot="scope">
          <el-tag v-bind:type="getGenderType(scope.row.gender)" size="large">
            {{ scope.row.gender }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="roleId" label="角色">
        <template v-slot="scope">
          <el-tag v-bind:type="getRoleType(scope.row.roleId)" size="large">
            {{ getRoleMsg(scope.row.roleId) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页标签-->
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
import {onMounted, reactive, ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import axios from "axios"
import {user} from "../../validate/userForm"
import {baseURL as base} from "../../store/store"
import {getGenderType, getRoleMsg, getRoleType} from "../../utils/userTableMessage";
import {curOperator} from "../../store/recordStore";

const baseURL = base().baseURL + "user"

let userSelectTable = ref()

let userData = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 5,
  data: []
})

let fuzzy = reactive({
  nickname: null,
  gender: null,
  roleId: 2
})

let operator = curOperator()

function resetPageData() {
  userData.pageSize = 10
  userData.pageNum = 1
}

function loadData() {//组件挂载之前从后端获取数据
  fuzzyLoad()
}

function fuzzyLoad() {//模糊查询
  let url = baseURL + "/fuzzy"
  userSelectTable.value.setCurrentRow(undefined)
  resetPageData()
  let promise = axios.post(url, fuzzy, {
    params: {
      pageSize: userData.pageSize,
      pageNum: userData.pageNum
    }
  })

  promise.then(response => {
    if (response.data.code == 200) {
      Object.assign(userData, response.data.data)
    }
  }).catch(error => {
    alert(error)
  })
}

onMounted(() => {
  loadData()
})

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
  //重置分页数据
  resetPageData()
  loadData()
}

function selectOperator(curRow) {
  if (curRow) {
    operator.id = curRow.id
    operator.nickname = curRow.nickname
  }
}
</script>

<style scoped>
.goodsTypeNameInput {
  margin: 5px;
  width: 200px;
}

.genderSelect {
  width: 200px;
  margin: 5px;
}
</style>