<template>
  <div class="loginBody">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">用户登录</h1>
        <el-form :model="loginForm" label-width="100px"
                 :rules="rules" ref="login">
          <el-form-item label="账号" prop="username">
            <el-input style="width: 200px" placeholder="请输入账号"
                      v-model="loginForm.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input style="width: 200px" type="password"
                      v-model="loginForm.password"
                      placeholder="请输入密码"
                      show-password
                      @keyup.enter.native="confirm"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {reactive, ref} from "vue";
import {baseURL as base} from '../store/store.ts'
import axios from "axios";
import {loginForm, rules} from '../validate/userLoginForm'
import {useRouter} from 'vue-router'
import {ElMessage} from "element-plus";

let baseURL = base().baseURL

let router = useRouter()

async function login() {//判断登录是否成功
  try {
    let response = await axios.post(baseURL + "/login", loginForm);
    if (response.data.code == 200) {
      sessionStorage.setItem("curUser", JSON.stringify(response.data.data))//将登录的用户数据赋值给curUser
      return true
    } else {
      return false
    }
  } catch (error) {
    alert(error)
  }
}

async function confirm() {//确认按钮
  let res = await login();
  if (res) {
    ElMessage.success("登录成功")
    router.push("/home")
  } else {
    ElMessage.error("登录失败")
  }
}
</script>

<style scoped>
.loginBody {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -250px;
  width: 450px;
  height: 330px;
  background: #fff;
  border-radius: 5%;

}

.login-title {
  margin: 20px 0;
  text-align: center;
}

.login-content {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 25px;
  left: 25px;
}
</style>