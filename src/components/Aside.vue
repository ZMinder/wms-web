<template>
  <el-menu class="main-menu"
           default-active="/Home"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           v-bind:collapse="collapse.isCollapse"
           v-bind:collapse-transition="collapse.isCollapseTransition"
  >
    <el-tooltip effect="dark" placement="right"
                content="首页" v-bind:disabled="!collapse.isCollapse">
      <el-menu-item index="/Home">
        <el-icon>
          <House/>
        </el-icon>
        <span slot="title">首页</span>
      </el-menu-item>
    </el-tooltip>
    <el-tooltip content="导航一" placement="right"
                effect="dark" v-bind:disabled="!collapse.isCollapse">
      <el-menu-item index="/One">
        <el-icon>
          <Discount/>
        </el-icon>
        <span>导航一</span>
      </el-menu-item>
    </el-tooltip>
    <el-tooltip content="导航二" placement="right"
                effect="dark" v-bind:disabled="!collapse.isCollapse">
      <el-menu-item index="/Two">
        <el-icon>
          <Grid/>
        </el-icon>
        <span>导航二</span>
      </el-menu-item>
    </el-tooltip>
  </el-menu>
</template>

<script lang="js" setup>
import {Discount, House, Grid} from '@element-plus/icons-vue'
import {asideCollapse} from '../store/store.ts'

let collapse = asideCollapse();

</script>

<style scoped>
.main-menu {
  height: 100vh;
}
</style>