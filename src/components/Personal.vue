<template>
  <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0px;margin: 0px;">
    <el-descriptions title="个人中心" :column="2" size="default" border>
      <el-descriptions-item label-width="150px">
        <template #label>
          <el-icon>
            <Avatar/>
          </el-icon>
          账号
        </template>
        {{ user.username }}
      </el-descriptions-item>
      <el-descriptions-item label-width="150px">
        <template #label>
          <el-icon>
            <Iphone/>
          </el-icon>
          电话
        </template>
        {{ user.phone }}
      </el-descriptions-item>
      <el-descriptions-item label-width="150px">
        <template #label>
          <el-icon>
            <Location/>
          </el-icon>
          性别
        </template>
        <el-tag :type="user.gender === '男' ? 'primary' : 'danger'" disable-transitions>
          <el-icon v-if="user.gender == '男'">
            <Female/>
          </el-icon>
          <el-icon v-else>
            <Male/>
          </el-icon>
          {{ user.gender }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label-width="150px">
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
import DateUtils from "./utils/DateUtils.vue";
import { reactive } from 'vue';
import { Avatar, Location, Female, Male, Iphone, Document } from '@element-plus/icons-vue';

const user = reactive(JSON.parse(sessionStorage.getItem('curUser') || '{}'));
</script>

<style scoped>
.el-descriptions {
  width: 90%;
  margin: 0px auto; /* 居中并增加上下边距 */
  background-color: #fff; /* 白色背景，更简洁明亮 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 轻微的阴影，增加立体感 */
  border-radius: 10px; /* 圆角边框 */
  padding: 20px; /* 增加内边距 */
}

.el-descriptions-item {
  margin-bottom: 16px; /* 增加条目间的垂直间距 */
}

.el-descriptions-item__label {
  font-size: 16px; /* 增大字体大小 */
  font-weight: 600; /* 字体加粗 */
  color: #333; /* 深色字体，增强可读性 */
}

.el-descriptions-item__content {
  font-size: 14px; /* 内容字体大小适中 */
  color: #555; /* 内容使用稍浅的颜色，与标签区分 */
}

.el-icon {
  font-size: 20px; /* 图标大小适中 */
  vertical-align: middle; /* 图标垂直居中对齐 */
}
</style>

