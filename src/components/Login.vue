<template>
  <div class="loginBody">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">用户登录</h1>
        <el-form :model="loginForm" label-width="100px"
                 :rules="rules" ref="login">
          <el-form-item label="账号" prop="username">
            <el-input class="input-field" placeholder="请输入账号"
                      v-model="loginForm.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input class="input-field" type="password"
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
  margin: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  font-family: 'Arial', sans-serif;
}

.loginDiv {

  width: 400px;
  padding: 40px 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.loginDiv:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.login-title {
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

el-form-item {
  width: 100%;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
}
</style>