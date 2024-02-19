<template>
  <div>
    <button @click="replay">replay</button>
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
    <div
      id="record"
      :style="{ width: '600px', height: '600px' }"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue';
import Sidebar from '../components/sidebar.vue';
import { Record } from '../../../../src/core';

const record = new Record();

onMounted(() => {
  record.start();
});

const replay = () => {
  record.replay(document.getElementById('record'));
};
</script>
<style lang="scss" scoped></style>
