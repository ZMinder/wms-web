<template>
  <div style="padding: 30px; font-size: 30px;">
    今天是：<span class="date">{{ nowTime }}</span>
    <span class="hour" style="margin-left: 5px;">{{ time.hour }}</span>
    <a class="split">:</a>
    <span class="minutes">{{ time.minutes }}</span>
    <a class="split">:</a>
    <span class="seconds">{{ time.seconds }}</span>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted} from 'vue';

const time = ref({
  hour: '',
  minutes: '',
  seconds: ''
});

const nowTime = ref('');
const week = [
  '星期天',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];

function getIncrease(num, digit) {
  let increase = '';
  for (let i = 0; i < digit; i++) {
    increase += '0';
  }
  return (increase + num).slice(-digit);
}

function timeFormat() {
  const newTime = new Date();
  time.value.hour = getIncrease(newTime.getHours(), 2);
  time.value.minutes = getIncrease(newTime.getMinutes(), 2);
  time.value.seconds = getIncrease(newTime.getSeconds(), 2);
  nowTime.value =
      getIncrease(newTime.getFullYear(), 4) +
      '年' +
      getIncrease(newTime.getMonth() + 1, 2) +
      '月' +
      getIncrease(newTime.getDate(), 2) +
      '日 ' +
      week[newTime.getDay()];
}

function dateTime() {
  timeFormat();
  setTimeout(() => {
    dateTime();
  }, 1000);
}

onMounted(() => {
  dateTime();
});
</script>

<style scoped>
.time {
  font-size: 1rem;
  margin-right: 0.5rem;
}

.split {
  animation: shark 1s step-end infinite;
  vertical-align: center;
  margin-left: 2px;
  margin-right: 2px;
}

@keyframes shark {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
