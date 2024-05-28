<template>
  <el-container class="layout-container-demo">
    <el-aside v-bind:width="collapse.asideWidth">
      <Aside></Aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right; font-size: 12px">
        <Header></Header>
      </el-header>

      <el-main>
        <Main></Main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'
import {asideCollapse} from '../store/store.js'

let collapse = asideCollapse()

</script>

<style scoped>
.layout-container-demo {
  height: 100%;
  margin-bottom: -8px;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  margin-top: -8px;
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: #858f96;
  margin-top: -8px;
  margin-left: -8px;
  height: 100%;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
  height: 100%;
}
</style>
