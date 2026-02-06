export default {
  name: "DialogContainer",
  inheritAttrs: false,
  render(h) {
    const { title = "标题", ...restAttrs } = this.$options._attrs || {};
    const headerStyles = `display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 15px 20px;
						border-bottom: 1px solid #e0e0e0;
						background-color: #f8f9fa;
						border-radius: 8px 8px 0 0;
						margin: 0;
						font-size: 18px;
						color: #333;
						font-weight:700;`;
    return h("div", null, [
      h("el-dialog", {
        props: {
          lockScroll: true,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          center: true,
          customClass: "latex-dialog",
          ...restAttrs,
          visible: this.visible,
        },
        on: {
          close: this.handleClose,
          submit: this.handleSubmit,
        },
        scopedSlots: {
          title: () => h("div", { style: headerStyles }, title),
          default: () =>
            h(this.component, {
              props: this.componentProps,
              on: {
                cancel: this.handleClose,
                submit: this.handleSubmit,
              },
            }),
        },
      }),
    ]);
  },
  props: {
    component: { type: Object, required: true }, // 组件构造器
    componentProps: Object,
  },
  provide() {
    return {
      parentVm: this,
    };
  },
  emits: ["close", "submit"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.visible = false;
      this.$emit("close");
    },
    /**
     * 提交表单
     */
    handleSubmit(...p) {
      this.$emit("submit", ...p);
      this.$nextTick().then(this.handleClose);
    },
  },
};
