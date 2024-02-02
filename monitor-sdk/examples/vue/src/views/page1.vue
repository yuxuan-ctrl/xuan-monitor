<!--
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-02 15:15:20
 * @FilePath: \monitor-sdk\examples\vue\src\views\page1.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="container" ref="pageRef">
    page1
    <button @click="push">pushState</button>
    <input type="text" />
  </div>
</template>
<script lang="ts" setup>
import {reactive, toRefs, onBeforeMount, onMounted} from "vue";
import {Click} from "../../../../src/core";

const pageRef = ref();

onMounted(() => {
  // document.addEventListener("selectionchange",(val)=>{
  //   console.log(val);

  // })
  Click.start();

  console.log(fetch("www.a.com"));
});

onUnmounted(()=>{
  console.log(1111111111111111111111);
  
  Click.stop();
})
const push = () => {
  history.pushState({test: 111}, "", "http://localhost:22000/page2");
};
</script>
<style lang="scss" scoped></style>
