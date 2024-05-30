<template>
  <el-menu class="main-menu"
           default-active="/Home"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           v-bind:collapse="collapse.isCollapse"
           v-bind:collapse-transition="collapse.isCollapseTransition"
           router
  >
    <el-tooltip effect="dark" placement="right"
                content="首页" v-bind:disabled="!collapse.isCollapse">
      <el-menu-item index="/home">
        <el-icon>
          <House/>
        </el-icon>
        <span slot="title">首页</span>
      </el-menu-item>
    </el-tooltip>
    <el-tooltip v-bind:content=item.menuName placement="right"
                effect="dark" v-bind:disabled="!collapse.isCollapse"
                v-for="(item,index) in menu" v-bind:key="index">
      <el-menu-item v-bind:index=item.menuPath>
        <el-icon >
          <component :is="item.menuIcon"></component>
        </el-icon>
        <span>{{ item.menuName }}</span>
      </el-menu-item>
    </el-tooltip>
  </el-menu>
</template>

<script lang="js" setup>
import {Discount, House, Grid} from '@element-plus/icons-vue'
import {asideCollapse} from '../store/store.ts'
import {reactive} from "vue";

let collapse = asideCollapse();
//动态菜单选项
let menu = reactive([
  {
    menuName: "管理员管理",
    menuPath: "/admin",
    menuIcon: Discount
  },
  {
    menuName: "用户管理",
    menuPath: "/user",
    menuIcon: Grid
  }
])

</script>

<style scoped>
.main-menu {
  height: 100vh;
}
</style>