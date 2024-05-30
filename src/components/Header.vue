<template>
  <div class="toolbar">
    <div class="icon-expand">
      <el-icon v-if="collapse.isCollapse">
        <Expand @click="cancelCollapse()"/>
      </el-icon>
      <el-icon v-if="!collapse.isCollapse">
        <Fold @click="doCollapse()"/>
      </el-icon>
    </div>
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
import {ArrowDownBold, Expand, Fold} from '@element-plus/icons-vue'
import {asideCollapse} from '../store/store.ts'

let collapse = asideCollapse()

//个人中心
function personal() {
  console.log("personal")
}

//退出登录
function logout() {
  console.log("logout")
}

//折叠侧边栏
function doCollapse() {
  collapse.collapse();
}

//展开侧边栏
function cancelCollapse() {
  collapse.cancelCollapse()
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
  cursor: pointer;
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