<template>
  <div class="container">
    page1
    <button @click="push">pushState</button>
  </div>
</template>
<script lang="ts" setup>
import {reactive, toRefs, onBeforeMount, onMounted} from "vue";

const push = () => {
  history.pushState({test: 111}, "", "http://localhost:22000/page2");
};
</script>
<style lang="scss" scoped></style>
