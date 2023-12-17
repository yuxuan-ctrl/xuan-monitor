<template>
  <div class="container">
    <ElContainer>
      <ElAside width="200px">
        <Sidebar />
      </ElAside>
      <ElMain>
        <router-view />
      </ElMain>
    </ElContainer>
  </div>
</template>
<script lang='ts' setup>
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
import Sidebar from "../components/sidebar.vue";
</script>
<style lang="scss" scoped>
</style>
