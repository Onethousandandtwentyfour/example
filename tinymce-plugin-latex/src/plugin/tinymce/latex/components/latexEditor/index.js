import { MathfieldElement } from "mathlive";
import {
  useRenderer as mathjaxRender,
  createLatexNodeText,
  createBlobUrl,
} from "@/plugin/tinymce/latex/renderLatex.js";
import "./index.less";

MathfieldElement.fontsDirectory = null; //不加载fonts
MathfieldElement.soundsDirectory = null; //不加载sounds

export default {
  name: "LatexEditor",
  props: {
    // 公式ID
    formulaId: {
      type: String,
      default: "",
    },
    // LaTeX 代码
    modelValue: {
      type: String,
      default: "",
    },
    mathVirtualKeyboardPolicy: {
      type: String,
      default: "auto",
    },
  },
  data() {
    return {
      // 快捷按钮
      quickButtons: [
        { icon: "½", label: "分数", latex: "\\frac{#0}{#1}" },
        { icon: "√", label: "根号", latex: "\\sqrt{#0}" },
        { icon: "xⁿ", label: "上标", latex: "#0^{#1}" },
        { icon: "xₙ", label: "下标", latex: "#0_{#1}" },
        { icon: "∑", label: "求和", latex: "\\sum_{#0}^{#1}" },
        { icon: "∫", label: "积分", latex: "\\int_{#0}^{#1}" },
        { icon: "lim", label: "极限", latex: "\\lim_{#0\\to#1}" },
        { icon: "( )", label: "括号", latex: "\\left(#0\\right)" },
      ],
      //可用的渲染模式
      previewModes: [
        {
          text: "MathJax",
          value: "mathjax",
          title: "前端 MathJax 渲染",
        },
      ],
      // 预览模式
      previewMode: "mathjax",
      // 当前 LaTeX 代码
      currentLatex: "",
      // LaTeX 解析激活中
      latexParseActivating: false,
      previewContent: "",
    };
  },
  computed: {
    /**
     * @description 是否正在编辑公式
     * @returns {boolean}
     */
    isEditingFormula() {
      return !!this.formulaId;
    },
  },
  watch: {
    modelValue(val) {
      this.currentLatex = val;
      this.$refs.mathFieldRef.setValue(val || "");
    },
    currentLatex(val) {
      if (val) {
        this.latexParseActivating = true;
        this.$nextTick()
          .then(() => {
            const insertingExp1 = new RegExp("#\\d+", "g");
            const insertingExp2 = new RegExp("\\\\placeholder\\{.*?\\}", "g");
            if (insertingExp1.test(val) || insertingExp2.test(val)) {
              this.previewContent = `<span>待输入完整公式</span>`;
            } else {
              this.previewContent = mathjaxRender(val, true);
            }
          })
          .finally(() => {
            this.latexParseActivating = false;
          });
      }
    },
  },
  mounted() {
    this.$nextTick().then(() => {
      Object.entries({
        smartMode: true,
        smartFence: true,
        smartSuperscript: true,
        removeExtraneousParentheses: true,
        mathModeSpace: "\\:",
      }).forEach((x) => {
        this.$refs.mathFieldRef[x[0]] = x[1];
      });

      // 初始 LaTeX 代码更新（watch.immediate=true的执行时机快于mounted,会导致this.$refs.mathFieldRef未定义）
      this.currentLatex = this.modelValue;
      this.$refs.mathFieldRef.setValue(this.modelValue || "");

      //math-field会在全局挂载mathVirtualKeyboard
      window.mathVirtualKeyboard.listeners["virtual-keyboard-toggle"].delete(
        this.virtualKeyboardToggle
      );
      window.mathVirtualKeyboard.listeners["virtual-keyboard-toggle"].add(
        this.virtualKeyboardToggle
      );
    });
  },
  beforeDestroy() {
    window.mathVirtualKeyboard.listeners["virtual-keyboard-toggle"].delete(
      this.virtualKeyboardToggle
    );
  },
  methods: {
    log(...p) {
      console.log(...p);
    },
    /**
     * @description 虚拟键盘切换
     */
    virtualKeyboardToggle() {
      // 处理虚拟键盘收起后，math-field无法通过键盘输入的问题
      if (!window.mathVirtualKeyboard.visible) {
        this.$refs.mathFieldRef.blur();
      }
    },
    /**
     * @description 数学编辑器输入
     * @param {Event} e
     */
    mathFieldInput(e) {
      let latex = e.target.value;
      // 清理 LaTeX 代码：移除 MathLive 生成的文本模式内容
      // MathLive 可能会生成如 "x^2+y^2=z^2" 后跟随 "x2+y2=z2" 的纯文本
      latex = latex.trim();
      // 移除双反斜杠后面的纯文本内容（如 \text{...}）
      // 但保留正常的 LaTeX 命令
      this.currentLatex = latex;
      this.$refs.mathFieldRef.setValue(latex || "");
    },
    /**
     * @description 插入/替换公式
     */
    handleInsert() {
      if (!this.currentLatex) return this.$message.warning("请先输入公式");
      this.$emit(
        "submit",
        this.isEditingFormula
          ? {
              formulaId: this.formulaId,
              latex: this.currentLatex,
              sourcePath: createBlobUrl(this.previewContent),
            }
          : createLatexNodeText(this.previewContent, this.currentLatex, {
              rendered: true,
            })
      );
    },
    /**
     * @description 插入模板
     * @param {string} latex
     */
    insertTemplate(latex) {
      if (this.$refs.mathFieldRef) {
        // this.$refs.mathFieldRef.executeCommand(["insert", latex]);
        this.currentLatex = latex;
        this.$refs.mathFieldRef.setValue(latex || "");
        this.$refs.mathFieldRef.focus();
      }
    },
    switchToMathJaxMode() {
      //切换渲染模式
    },
  },
  render(h) {
    // 渲染快捷工具栏按钮
    const renderToolButtons = () => {
      return this.quickButtons.map((btn) =>
        h(
          "button",
          {
            class: "btn-tool",
            attrs: { type: "button", title: btn.label },
            key: btn.label,
            on: {
              click: () => this.insertTemplate(btn.latex),
            },
          },
          btn.icon
        )
      );
    };

    // 渲染预览模式按钮
    const renderPreviewModeButtons = () => {
      return this.previewModes.map((btn) =>
        h(
          "button",
          {
            class: ["mode-btn", { active: this.previewMode === btn.value }],
            attrs: { type: "button", title: btn.title },
            key: btn.value,
            on: {
              click: this.switchToMathJaxMode,
            },
          },
          btn.text
        )
      );
    };

    // 渲染编辑器头部
    const renderEditorHeader = () => {
      return h("div", { class: "editor-header" }, [
        h("span", { class: "editor-title" }, "LaTeX 公式编辑器"),
        h(
          "button",
          {
            class: "btn-primary btn-small",
            attrs: { type: "button" },
            on: { click: this.handleInsert },
          },
          `✅ ${this.isEditingFormula ? "替换" : "插入"}公式`
        ),
      ]);
    };

    // 渲染 MathLive 编辑器
    const renderMathLiveSection = () => {
      return h("div", { class: "mathlive-section" }, [
        h("label", { class: "section-label" }, "可视化编辑器："),
        h(
          "math-field",
          {
            ref: "mathFieldRef",
            class: "math-field",
            attrs: {
              "math-virtual-keyboard-policy": this.mathVirtualKeyboardPolicy,
              placeholder: "\\text{在此处输入公式}",
            },
            on: {
              input: this.mathFieldInput,
              show: () => this.log("show"),
              hide: () => this.log("hide"),
            },
          },
          this.currentLatex
        ),
      ]);
    };

    // 渲染预览区域
    const renderPreviewSection = () => {
      const previewHeader = h("div", { class: "preview-header" }, [
        h(
          "el-tooltip",
          {
            props: {
              effect: "light",
              placement: "top",
            },
          },
          [
            h("label", { class: "section-label2" }, " 实时预览： "),
            h("img", {
              //非作用域插槽-老版本兼容写法
              slot: "content",
              style: {
                width: "300px",
                objectFit: "contain",
                display: "block",
              },
              attrs: {
                src: require("../../assets/display-styles.png"),
                alt: "Display Mode",
              },
            }),
          ]
        ),
        h("div", { class: "preview-mode-switch" }, renderPreviewModeButtons()),
      ]);

      const previewBody = this.currentLatex
        ? h("div", {
            class: "preview-box",
            domProps: { innerHTML: this.previewContent },
          })
        : h("div", { class: "preview-placeholder" }, "请在编辑器中输入公式");

      const previewLoading = this.latexParseActivating
        ? h(
            "div",
            { class: "preview-loading" },
            `正在生成 ${this.previewMode} 预览...`
          )
        : null;

      return h("div", { class: "preview-section" }, [
        previewHeader,
        previewBody,
        previewLoading,
      ]);
    };

    // 渲染编辑器主体
    const renderEditorBody = () => {
      return h("div", { class: "editor-body" }, [
        renderMathLiveSection(),
        renderPreviewSection(),
      ]);
    };

    // 渲染 LaTeX 代码显示区
    const renderLatexCodeSection = () => {
      return h("div", { class: "latex-code-section" }, [
        h("label", { class: "section-label" }, "LaTeX 代码："),
        h("div", { class: "latex-code-display" }, this.currentLatex || "(空)"),
      ]);
    };

    // 渲染工具栏
    const renderEditorToolbar = () => {
      return h("div", { class: "editor-toolbar" }, [
        h("div", { class: "toolbar-section" }, [
          h("span", { class: "toolbar-label" }, "常用符号："),
          ...renderToolButtons(),
        ]),
      ]);
    };

    // 渲染帮助提示
    const renderHelpSection = () => {
      return h("div", { class: "help-section" }, [
        h("details", [
          h("summary", "💡 使用提示"),
          h("div", { class: "help-content" }, [
            h("p", [h("strong", "可视化编辑：")]),
            h("ul", [
              h("li", "直接在编辑器中点击，使用虚拟键盘输入数学符号"),
              h("li", [
                "支持键盘快捷键：",
                h("code", "/"),
                " 创建分数，",
                h("code", "^"),
                " 创建上标",
              ]),
              h("li", "点击工具栏按钮快速插入常用模板"),
            ]),
            h("p", [h("strong", "快捷键：")]),
            h("ul", [
              h("li", [h("kbd", "Ctrl + Z"), "：撤销"]),
              h("li", [h("kbd", "Ctrl + Y"), "：重做"]),
              h("li", [h("kbd", "Tab"), "：切换到下一个占位符"]),
            ]),
          ]),
        ]),
      ]);
    };

    // 渲染编辑器包装
    const renderEditorWrap = () => {
      return h("div", { class: "latex-editor-wrap" }, [
        renderEditorHeader(),
        renderEditorBody(),
        renderLatexCodeSection(),
        renderEditorToolbar(),
        renderHelpSection(),
      ]);
    };

    // 渲染提示信息
    const renderHint = () => {
      if (this.isEditingFormula) {
        return h(
          "div",
          { class: "editing-hint" },
          '✏️ 当前正在编辑公式，请修改后点击"替换公式"按钮替换原公式'
        );
      } else {
        return h(
          "div",
          { class: "insert-hint" },
          '💡 在编辑器中编辑公式，然后点击"插入公式"按钮，将公式插入到题干光标位置'
        );
      }
    };

    // 主渲染
    return h("div", { class: "latex-editor" }, [
      renderEditorWrap(),
      renderHint(),
    ]);
  },
};
