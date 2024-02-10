<!--
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-12-26 14:10:33
 * @FilePath: \monitor-sdk\examples\vue\src\views\page3.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="container">page3</div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue';
import { request } from '../utils/request';
onMounted(() => {
  // new Error("error");
  // eval("a=1s");
  request({
    url: '/api/user/login',
    method: 'post',
    data: {
      userName: 'lyx',
      passWord: '1234561',
    },
  });
});
</script>
<style lang="scss" scoped></style>
