<template>
  <div class="my-buttons">
    <el-button type="primary" size="small" @click="insertTestContent">
      测试插入内容
      <el-tooltip content="会直接解析内部公式" effect="light">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-button>
    <el-button type="primary" size="small" @click="submit">
      提交
      <el-tooltip content="支持Ctrl+S" effect="light">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-button>
  </div>
</template>
<script>
export default {
  name: "MyButtons",
  props: {
    editor: {
      type: Object,
      default: null,
    },
  },
  emits: ["submit"],
  mounted() {
    document.addEventListener("keydown", this.keydownHandler);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydownHandler);
  },
  methods: {
    /**
     * 键盘事件处理
     * @param {Event} e 事件对象
     */
    keydownHandler(e) {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        this.submit();
      }
    },
    /**
     * 提交
     */
    submit() {
      this.$emit("submit", this.editor.getContent());
    },
    /**
     * 插入测试内容
     */
    insertTestContent() {
      this.editor.insertContent(
        `在物理学中，动能是物体由于运动而具有的能量。一个质量为<span data-latex="${encodeURIComponent(
          "m"
        )}"></span>、速度为<span data-latex="${encodeURIComponent(
          "v"
        )}"></span>的物体，其动能<span data-latex="${encodeURIComponent(
          "K"
        )}"></span>可表示为<span data-latex="${encodeURIComponent(
          "\\frac{1}{2}mv^2"
        )}"></span>。这个公式表明动能与速度的平方成正比，因此即使速度小幅增加，动能也会显著上升。当考虑相对论效应时，经典动能公式不再适用，需使用更精确的表达式。此时总能量<span data-latex="${encodeURIComponent(
          "E"
        )}"></span>由著名的质能关系给出：
          <span data-latex="${encodeURIComponent("E=\\gamma mc^2")}"></span>
          其中<span data-latex="${encodeURIComponent(
            "\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}"
          )}"></span>为洛伦兹因子，<span data-latex="${encodeURIComponent(
          "c"
        )}"></span>是光速。静止能量则为<span data-latex="${encodeURIComponent(
          "E_0 = mc^2"
        )}"></span>，动能即为总能量减去静止能量。这种处理方式在粒子物理和高能实验中尤为重要，确保了在接近光速运动时计算结果的准确性。通过对比经典与相对论动能，我们能更深入理解速度对能量的影响。`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.my-buttons {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 5px;
  top: 0;
  z-index: 1;
}
</style>
