<!--
 * @Author: yuxuanli
 * @Date: 2023-08-07 09:11:19
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-12-18 17:40:19
 * @FilePath: \monitor-sdk\examples\vue\src\App.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div class="container">
    <router-view> </router-view>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import { useFetch } from "@vueuse/core";
const text = ref<string>("");
</script>

<style>
.header {
  height: 300px;
}
.container {
  width: 1200px;
  min-height: calc(100vh - 60px);
}

.monaco-container {
  height: 300px;
}

.h-100 {
  height: 1000px;
}
</style>
