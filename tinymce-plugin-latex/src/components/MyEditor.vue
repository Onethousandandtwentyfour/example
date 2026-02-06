<template>
  <div class="my-editor">
    <div class="editor-wrap">
      <editor ref="editor" :init="editorConfig" @onInit="onEditorInit"></editor>
      <my-buttons v-if="editor" :editor="editor" @submit="onSubmit" />
    </div>
    <div class="editor-raw-content">
      <code>
        {{ editorRawContent }}
      </code>
    </div>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import Lang from "@/plugin/tinymce/langs/zh_CN.js";
import { registerLatexPlugin } from "@/plugin/tinymce/latex/index.js";
import MyButtons from "@/components/MyButtons.vue";

// 标准注册
// tinymce.PluginManager.add("latex", latexPlugin);

export default {
  name: "MyEditor",
  components: {
    Editor,
    MyButtons,
  },
  data() {
    const toolbarDef = `code|bold italic underline | fontsizeselect formatselect | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | undo redo | link unlink imageupload YouYunVideo formula |table|removeformat| fullscreen latex`;
    return {
      editorConfig: registerLatexPlugin(
        {
          base_url: `${process.env.VUE_APP_PUBLIC_PATH}tinymce/`,
          selector: "",
          language: "zh_CN",
          language_url: tinymce.addI18n("zh_CN", Lang),
          toolbar: toolbarDef,
          width: "100%",
          height: "100%",
          placeholder: "",
          branding: false,
          // 标准注册配置（设置paste，将paste事件也包含到latex插件中处理？？？）
          // plugins: "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount latex paste",
          // menubar: "file edit view insert format table tools help latex",
          // menu: {
          //   latex: {
          //     title: "公式",
          //     items: "latex-add",
          //   },
          // },
          //快捷注册配置
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          menubar: true,
          toolbar_mode: "wrap",
          fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 36pt",
          resize: true,
          paste_as_text: false,
          entity_encoding: "raw",
        },
        { paste: true }
      ),
      editor: null,
      editorRawContent: "",
    };
  },
  mounted() {
    window._debugThis = this;
  },
  methods: {
    onEditorInit() {
      this.editor = this.$refs.editor.editor;
    },
    onSubmit(content) {
      this.editorRawContent = content;
    },
  },
};
</script>
<style lang="less" scoped>
.my-editor {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px;

  .editor-wrap {
    flex: 1;
    height: 100%;
    position: relative;

    /deep/ .tox-tinymce {
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      border-color: rgba(0, 0, 0, 0);
    }
  }

  .editor-raw-content {
    flex: 0.5;
    min-width: 300px;
    height: 100%;
    background-color: #fff;
    margin-left: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    background-color: #181a1b;
    color: #c3653d;
    padding: 10px;
    box-sizing: border-box;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-y: auto;
  }
}
</style>
