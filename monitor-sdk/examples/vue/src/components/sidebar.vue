<template>
  <el-menu
    mode="vertical"
    :default-active="$route.path"
    router
    @select="handleSelect"
  >
    <el-menu-item index="/" :key="0">
      <el-icon><home /></el-icon>
      <span>Home</span>
    </el-menu-item>
    <el-menu-item index="/page1" :key="1">
      <el-icon><document /></el-icon>
      <span>Page 1</span>
    </el-menu-item>
    <el-menu-item index="/page2" :key="2">
      <el-icon><folder /></el-icon>
      <span>Page 2</span>
    </el-menu-item>
    <el-menu-item index="/page3" :key="3">
      <el-icon><settings /></el-icon>
      <span>Page 3</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { defineComponent } from "vue";
import { ElMenu, ElMenuItem } from "element-plus";

export default defineComponent({
  name: "Sidebar",
  components: {
    ElMenu,
    ElMenuItem,
  },
  methods: {
    handleSelect(key, indexPath) {
      //   console.log(`Selected menu item: ${key} at indexPath: ${indexPath}`);
    },
  },
});
</script>