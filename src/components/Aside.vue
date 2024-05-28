<template>
  <el-scrollbar>
    <el-menu class="main-menu"
             default-active="/Home"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="/Home">
        <el-icon>
          <House/>
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/One">
        <el-icon>
          <Discount/>
        </el-icon>
        <span>导航一</span>
      </el-menu-item>
      <el-menu-item index="/Two">
        <el-icon>
          <Grid/>
        </el-icon>
        <span>导航二</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="js" setup>
import {Discount, House, Grid} from '@element-plus/icons-vue'

</script>

<style scoped>
.main-menu {
  height: 100vh;
}
</style>