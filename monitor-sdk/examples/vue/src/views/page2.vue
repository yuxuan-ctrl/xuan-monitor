<template>
  <div class="container">page2</div>
</template>
<script lang='ts' setup>
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
new Promise((resolve, reject) => {
  reject({ a: 1 });
});
</script>
<style lang="scss" scoped>
</style>
