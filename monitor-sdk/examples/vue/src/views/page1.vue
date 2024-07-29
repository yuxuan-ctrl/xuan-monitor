<!--
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-03-21 11:15:11
 * @FilePath: \monitor-sdk\examples\vue\src\views\page1.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div
    class="container"
    ref="pageRef"
  >
    page1
    <button @click="push">pushState</button>
    <input type="text" />
    <button @click="putError">pushState</button>

    <br />
    <el-button-group>
      <el-button
        type="primary"
        @click="
          () => {
            inputType = true;
          }
        "
      >
        type=1
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            inputType = false;
          }
        "
      >
        type=2
      </el-button>
    </el-button-group>

    <div v-if="inputType">
      <label>手机号</label>
      <input type="text" />
    </div>
    <div v-else>
      <label>账号</label>
      <input type="text" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue';
// import {Click,Resize} from "../../../../src/core";

const pageRef = ref();
const inputType = ref(true);
onMounted(() => {
  // Click.start();
  // Resize.start(window);
  fetch('/api/user/getUserList');
  console.log(fetch('www.a.com'));
});

onUnmounted(() => {
  console.log(1111111111111111111111);
  // Click.stop();
});

const putError = () => {
  const a = '';
  console.log(a.push());
};

const push = () => {
  history.pushState({ test: 111 }, '', 'http://localhost:22000/page2');
};
</script>
<style lang="scss" scoped></style>
