<template>
  <div class="latex-editor">
    <div class="latex-editor-wrap">
      <!-- 标题  -->
      <div class="editor-header">
        <span class="editor-title">LaTeX 公式编辑器</span>
        <button
          type="button"
          class="btn-primary btn-small"
          @click="handleInsert"
        >
          ✅ {{ isEditingFormula ? "替换" : "插入" }}公式
        </button>
      </div>
      <!-- 编辑区  -->
      <div class="editor-body">
        <!-- MathLive 可视化编辑器 -->
        <div class="mathlive-section">
          <label class="section-label">可视化编辑器：</label>
          <math-field
            ref="mathFieldRef"
            class="math-field"
            :math-virtual-keyboard-policy="mathVirtualKeyboardPolicy"
            placeholder="\text{在此处输入公式}"
            @input="mathFieldInput"
            @show="log('show')"
            @hide="log('hide')"
          >
            {{ currentLatex }}
          </math-field>
        </div>

        <!-- 实时预览 -->
        <div class="preview-section">
          <div class="preview-header">
            <el-tooltip effect="light" placement="top">
              <label class="section-label2"> 实时预览： </label>
              <template #content>
                <img
                  style="width: 300px; object-fit: contain; display: block"
                  src="../assets/display-styles.png"
                  alt="Display Mode"
                />
              </template>
            </el-tooltip>
            <div class="preview-mode-switch">
              <button
                v-for="btn of previewModes"
                type="button"
                :key="btn.value"
                :class="['mode-btn', { active: previewMode === btn.value }]"
                :title="btn.title"
                @click="switchToMathJaxMode"
              >
                {{ btn.text }}
              </button>
            </div>
          </div>
          <div
            v-if="currentLatex"
            class="preview-box"
            v-html="previewContent"
          ></div>
          <div v-else class="preview-placeholder">请在编辑器中输入公式</div>
          <div v-if="latexParseActivating" class="preview-loading">
            正在生成 {{ previewMode }} 预览...
          </div>
        </div>
      </div>

      <!-- LaTeX 代码显示 -->
      <div class="latex-code-section">
        <label class="section-label">LaTeX 代码：</label>
        <div class="latex-code-display">{{ currentLatex || "(空)" }}</div>
      </div>

      <!-- 快捷工具栏 -->
      <div class="editor-toolbar">
        <div class="toolbar-section">
          <span class="toolbar-label">常用符号：</span>
          <button
            type="button"
            v-for="btn in quickButtons"
            :key="btn.label"
            :title="btn.label"
            class="btn-tool"
            @click="insertTemplate(btn.latex)"
          >
            {{ btn.icon }}
          </button>
        </div>
      </div>

      <!-- 帮助提示 -->
      <div class="help-section">
        <details>
          <summary>💡 使用提示</summary>
          <div class="help-content">
            <p><strong>可视化编辑：</strong></p>
            <ul>
              <li>直接在编辑器中点击，使用虚拟键盘输入数学符号</li>
              <li>
                支持键盘快捷键：<code>/</code> 创建分数，<code>^</code> 创建上标
              </li>
              <li>点击工具栏按钮快速插入常用模板</li>
            </ul>
            <p><strong>快捷键：</strong></p>
            <ul>
              <li><kbd>Ctrl + Z</kbd>：撤销</li>
              <li><kbd>Ctrl + Y</kbd>：重做</li>
              <li><kbd>Tab</kbd>：切换到下一个占位符</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
    <!-- 提示 -->
    <div v-if="isEditingFormula" class="editing-hint">
      ✏️ 当前正在编辑公式，请修改后点击"替换公式"按钮替换原公式
    </div>
    <div v-else class="insert-hint">
      💡 在编辑器中编辑公式，然后点击"插入公式"按钮，将公式插入到题干光标位置
    </div>
  </div>
</template>
<script>
import { MathfieldElement } from "mathlive";
MathfieldElement.fontsDirectory = null; //不加载fonts
MathfieldElement.soundsDirectory = null; //不加载sounds
//mathlive是交互式的LaTeX编辑器，单独转化公式时需要额外导出全局css,所以这里使用mathjax导出svg进行预览
import {
  useRenderer as mathjaxRender,
  createLatexNodeText,
  createBlobUrl,
} from "@/plugin/tinymce/latex/renderLatex.js";

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
    window._debugThis = this;
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
};
</script>
<style lang="less" scoped>
.latex-editor {
  --mt: clamp(50px, 15vh, 60px);
  max-height: calc(100vh - var(--mt) - 60px - 50px);
  padding: 20px;
  overflow: hidden;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .latex-editor-wrap {
    flex: 1;
    width: 100%;
    height: 0;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

    .section-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #555;
      margin-bottom: 10px;
    }

    .section-label2 {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #555;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);

      .editor-title {
        font-weight: 700;
        color: white;
        font-size: 16px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .btn-primary {
        background-color: #3498db;
        color: white;

        &:hover {
          background-color: #2980b9;
        }

        &.btn-small {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          }
        }
      }
    }

    .editor-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;

      .mathlive-section,
      .preview-section {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .mathlive-section {
        .math-field {
          width: 100%;
          font-size: 24px;
          padding: 15px;
          border: 2px solid #667eea;
          border-radius: 6px;
          min-height: 80px;
          background: #f8f9fa;
        }
      }

      .preview-section {
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .preview-mode-switch {
          display: flex;
          gap: 4px;
          background: #f0f0f0;
          padding: 4px;
          border-radius: 6px;

          .mode-btn {
            padding: 6px 14px;
            background: transparent;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
          }

          .mode-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
          }

          .mode-btn:hover:not(.active) {
            background: #e0e0e0;
          }
        }

        .preview-box {
          padding: 20px;
          background: #f8f9fa;
          border: 2px dashed #e1e8ed;
          border-radius: 6px;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .preview-placeholder {
          color: #999;
          font-size: 14px;
          font-style: italic;
        }

        .preview-error {
          color: #e74c3c;
          font-size: 14px;
        }

        .preview-loading {
          text-align: center;
          padding: 10px;
          color: #999;
          font-size: 13px;
          font-style: italic;
        }
      }
    }

    .latex-code-section {
      background: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .latex-code-display {
        padding: 12px;
        background: #282c34;
        color: #61dafb;
        border-radius: 4px;
        font-family: "Consolas", "Monaco", monospace;
        font-size: 14px;
        overflow-x: auto;
        min-height: 40px;
      }
    }

    .editor-toolbar {
      background: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .toolbar-section {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      .toolbar-label {
        font-size: 13px;
        font-weight: 600;
        color: #555;
        margin-right: 10px;
      }

      .btn-tool {
        padding: 8px 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
      }

      .btn-tool:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
      }

      .btn-tool:active {
        transform: translateY(0);
      }
    }

    .help-section {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .help-section {
        summary {
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          user-select: none;

          &:hover {
            color: #667eea;
          }
        }
      }

      .help-content {
        margin-top: 12px;
        font-size: 13px;
        color: #666;
        p {
          margin: 10px 0 5px;
          font-weight: 600;
          color: #555;
        }
        ul {
          margin: 5px 0;
          padding-left: 20px;
        }
        li {
          margin: 5px 0;
        }
        code,
        kbd {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: "Consolas", monospace;
          font-size: 12px;
        }
        kbd {
          border: 1px solid #ccc;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .insert-hint {
    flex-shrink: 0;
    margin-top: 10px;
    padding: 10px;
    background: #e7f3ff;
    border-left: 3px solid #3498db;
    font-size: 13px;
    color: #555;
    border-radius: 4px;
  }

  .editing-hint {
    flex-shrink: 0;
    margin-top: 10px;
    padding: 10px;
    background: #fff3cd;
    border-left: 3px solid #ffc107;
    font-size: 13px;
    color: #856404;
    border-radius: 4px;
  }
}
</style>
<style lang="less">
body {
  --keyboard-zindex: 9999;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}
</style>
