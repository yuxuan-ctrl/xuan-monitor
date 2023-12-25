<template>
  <div class="container">page3</div>
</template>
<script lang='ts' setup>
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
onMounted(() => {
  new Error("error");
  // eval("a=1s");
});
</script>
<style lang="scss" scoped>
</style>
