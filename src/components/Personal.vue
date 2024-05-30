<template>
  <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0px;margin: 0px;">
    <el-descriptions title="个人中心" :column="2" size="default" border>
      <el-descriptions-item>
        <template #label>
          <el-icon>
            <Avatar/>
          </el-icon>
          账号
        </template>
        {{ user.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <el-icon>
            <Iphone/>
          </el-icon>
          电话
        </template>
        {{ user.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <el-icon>
            <Location/>
          </el-icon>
          性别
        </template>
        <el-tag
            :type="user.gender === '男' ? 'primary' : 'danger'"
            disable-transitions>
          <el-icon v-if="user.gender == '男'">
            <Female/>
          </el-icon>
          <el-icon v-else>
            <Male/>
          </el-icon>
          {{ user.gender }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <el-icon>
            <Document/>
          </el-icon>
          角色
        </template>
        <el-tag type="success">
          {{ user.roleId == 0 ? "超级管理员" : (user.roleId == 1 ? "管理员" : "用户") }}
        </el-tag>

      </el-descriptions-item>
    </el-descriptions>

    <DateUtils></DateUtils>
  </div>
</template>

<script setup lang="ts">
import DateUtils from "./utils/DateUtils.vue"
import {reactive} from 'vue'
import {Avatar, Location, Female, Male, Iphone, Document} from '@element-plus/icons-vue'

let user = reactive({})

user = JSON.parse(sessionStorage.getItem('curUser'))
</script>

<style scoped>
.el-descriptions {
  width: 90%;

  margin: 0 auto;
  text-align: center;
}
</style>