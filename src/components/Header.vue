<template>
  <div class="toolbar">
    <el-icon class="icon-expand">
      <Expand/>
    </el-icon>
    <div class="welcome-text">
      <span>欢迎来到仓库管理系统</span>
    </div>
    <span class="username">Tom</span>
    <el-dropdown>
      <el-icon class="drop-icon">
        <ArrowDownBold/>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="personal()">个人中心</el-dropdown-item>
          <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import {ArrowDownBold, Expand} from '@element-plus/icons-vue'
//个人中心
function personal() {
  console.log("personal")
}

//退出登录
function logout() {
  console.log("logout")
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.icon-expand {
  flex-shrink: 0;
  font-size: 25px;
}

.welcome-text {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  font-size: 30px;
  align-items: center;
}

.username {
  font-size: 18px;
  margin-right: 5px;
}

.drop-icon {
  font-size: 15px;
  margin-top: 1px;
}
</style>