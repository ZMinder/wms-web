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
      <el-button type="primary" @click="saveUser()">添加用户</el-button>
    </div>
    <el-table :data="userData.data" border stripe
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
      <el-table-column prop="operation" label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="default" @click="modify(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除吗？" @confirm="remove(scope.row.username)">
            <template #reference>
              <el-button type="danger" size="default">删除</el-button>
            </template>
          </el-popconfirm>
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
    <!--    对话框标签-->
    <el-dialog v-model="dialogFormVisible" title="编辑信息"
               width="500px" @close="resetForm()">
      <el-form v-bind:model="user" ref="userForm" v-bind:rules="userRules"
               label-position="right">
        <el-form-item prop="username" label="账号"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.username" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item prop="nickname" label="姓名"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.nickname" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item prop="password" label="密码"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.password" placeholder="请输入密码" show-password/>
        </el-form-item>
        <el-form-item v-if="modifyOrSave" prop="confirmedPassword" label="确认密码"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.confirmedPassword" placeholder="请确认密码" show-password/>
        </el-form-item>
        <el-form-item prop="age" label="年龄"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.age" placeholder="请输入年龄"/>
        </el-form-item>
        <el-form-item prop="gender" label="性别"
                      label-width="70" style="width: 300px">
          <el-select v-model="user.gender" placeholder="请选择性别">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话"
                      label-width="70" style="width: 300px">
          <el-input v-model="user.phone" placeholder="请输入电话"/>
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
import {nextTick, onBeforeMount, reactive, ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import axios from "axios"
import {ElMessage} from "element-plus";
import {user, userRules, resetUser} from "../../validate/userForm"
import {baseURL as base} from "../../store/store";

const baseURL = base().baseURL + "user"

let modifyOrSave = ref()

let dialogFormVisible = ref(false)//处理对话框是否显示

const userForm = ref()//绑定form表单

let userData = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 5,
  data: []
})

let fuzzy = reactive({
  nickname: null,
  gender: null,
  roleId: 1
})

function resetPageData() {
  userData.pageSize = 10
  userData.pageNum = 1
}

function loadData() {//组件挂载之前从后端获取数据
    fuzzyLoad()
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
      // console.log(userData)
    }
  }).catch(error => {
    alert(error)
  })
}

onBeforeMount(() => {
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

function doAddOrModify() {
  userForm.value.validate(valid => {
    if (valid) {
      user.roleId = 1//设置为管理员
      if (!user.id) {//id为空是添加
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
  userForm.value.resetFields()//去除校验
  Object.assign(user, resetUser)//赋空值
}

function doSave() {
  //将数据返回给后端
  let promise = axios.post(baseURL, user);
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
  let promise = axios.put(baseURL, user);
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
  modifyOrSave.value = false
  Object.assign(user, row)
  user.preUsername = user.username
  dialogFormVisible.value = true
}

function remove(username) {
  doRemove(username)
}

function doRemove(username) {
  let url = baseURL + "/" + username
  const promise = axios.delete(url)
  promise.then(response => {
    ElMessage.success("删除成功")
    loadData()
  }).catch(error => {
    ElMessage.error("删除失败")
  })
}

function saveUser() {//添加用户
  dialogFormVisible.value = true
  modifyOrSave.value = true
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