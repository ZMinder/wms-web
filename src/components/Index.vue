<template>
  <el-container class="layout-container-demo">
    <el-aside :width="collapse.asideWidth">
      <Aside></Aside>
    </el-aside>

    <el-container class="inner-container">
      <el-header class="layout-header">
        <Header></Header>
      </el-header>

      <el-main class="layout-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue';
import Header from './Header.vue';
import { asideCollapse } from '../store/store.ts';

const collapse = asideCollapse();
</script>

<style scoped>

.layout-container-demo {
  display: flex;
  height: 100vh;
  margin: -8px;
}

.inner-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout-header {
  text-align: right;
  font-size: 12px;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  flex-shrink: 0;
  padding: 0 20px;
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: #858f96;
  flex-shrink: 0;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-main {
  padding: 0;
  flex-grow: 1;
  overflow: auto;
  background-color: #ffffff;
}
</style>
