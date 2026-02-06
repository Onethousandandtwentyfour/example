<template>
  <div id="app">
    <my-editor></my-editor>
  </div>
</template>

<script>
import MyEditor from "./components/MyEditor.vue";
export default {
  name: "App",
  components: {
    MyEditor,
  },
  mounted() {
    document.title = "验证Tinymce扩展Latex的可行性";
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.latex-dialog {
  width: 80%;
  max-width: 800px;
  min-width: 600px;
  border-radius: 8px !important;
  margin-top: clamp(50px, 15vh, 60px) !important;
  overflow: hidden;

  .el-dialog__header {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding: 1px !important;
  }
}
</style>
