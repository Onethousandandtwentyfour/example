import showDialog from "./utils/use-dialog.js";
// import LatexEditor from "./components/LatexEditor.vue";
import LatexEditor from "./components/latexEditor/index.js";
import renderLatex from "./renderLatex.js";
import { closest } from "./utils/polyfill.js";

// 插件配置
const pluginConfig = {
  // 插件预设 tinymce 的配置
  tinymce: {
    allMenuBar: ["file", "edit", "view", "insert", "format", "table", "tools"],
  },
  menuKey: "latex-menu",
  menu: {
    title: "公式",
    items: "latex-add",
  },
};

/**
 * @description 公共注册处理
 * @param {*} editor editor
 */
function commonRegisterHandler(editor) {
  // 工具栏公式
  editor.ui.registry.addButton("latex", {
    icon: "insert-character",
    onAction: () => {
      showDialog(
        LatexEditor,
        {
          editor,
        },
        {
          title: "工具栏公式",
        }
      ).then((res) => {
        // 处理公式新增
        if (res) editor.insertContent(res);
      });
    },
  });

  // 添加（公式）菜单栏子菜单-菜单栏公式
  editor.ui.registry.addMenuItem("latex-add", {
    text: "菜单栏公式",
    onAction: () => {
      showDialog(
        LatexEditor,
        {
          editor,
        },
        {
          title: "菜单栏公式",
        }
      ).then((res) => {
        // 处理公式新增
        if (res) editor.insertContent(res);
      });
    },
  });

  // 监听销毁事件
  editor.on("remove", () => {
    renderLatex.clear();
  });

  // 添加公式点击事件
  editor.on("click", (e) => {
    if (
      e.target.classList.contains("formula-box") &&
      e.target.dataset.formulaId
    ) {
      showDialog(
        LatexEditor,
        {
          editor,
          formulaId: e.target.dataset.formulaId,
          modelValue: decodeURIComponent(e.target.dataset.latex),
        },
        {
          title: "LaTeX 公式编辑",
        }
      ).then((res) => {
        if (res) {
          // 处理公式修改
          const token = closest(e.target, ".formula-box");
          // 1. 保存当前光标位置
          const bookmark = editor.selection.getBookmark();
          // 2. 修改 DOM
          token.setAttribute("data-latex", encodeURIComponent(res.latex));
          token.querySelector("img").src = res.sourcePath;
          // 3. 告诉 TinyMCE：“内容变了，请记录”
          // 手动添加 undo 步骤
          editor.undoManager.add();
          // 4. 恢复光标
          editor.selection.moveToBookmark(bookmark);
        }
      });
    }
  });

  // 插入content处理 => 覆写mceInsertContent的实现
  editor.addCommand("mceInsertContent", function (_ui, value) {
    let usableValue = "";
    if (typeof value === "string") {
      usableValue = value;
    } else if (typeof value === "object" && value.content) {
      usableValue = value.content;
    } else {
      console.warn("未知的 value 类型", value);
    }
    if (usableValue) {
      usableValue = usableValue
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;quot;/g, '"')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;apos;/g, "'");

      // 处理 LaTeX 占位符
      const processed = usableValue.replace(
        /<span\s+[^>]*?data-latex="([^"]*)"[^>]*?><\/span>/g,
        (_match, latexContent) => `$$${decodeURIComponent(latexContent)}$$`
      );
      // 确保返回 HTML 字符串
      const finalHtml = renderLatex(processed);
      editor.execCommand("insertHTML", false, finalHtml);
    }
  });

  //覆写GetContent的实现
  editor.on("GetContent", (e) => {
    // 使用正则表达式匹配 <span data-latex="xxx">...</span> 并替换为 <span data-latex="xxx"></span>
    const processed = e.content.replace(
      /<span\s+[^>]*?data-latex="([^"]*)"[^>]*?>(.*?)<\/span>/g,
      (_match, latex) => `<span data-latex="${latex}"></span>`
    );
    // 直接修改 e.content，getContent() 将返回这个值
    e.content = processed;
  });
}

/**
 * @description 官方标准-注册latex插件
 * @param {object} editor editor
 */
export function latexPlugin(editor) {
  commonRegisterHandler(editor);
  return {
    name: "latex插件",
    url: "",
  };
}

/**
 * @description 快捷方式-注册latex插件
 * @param {object} config config
 * @param {object} options options
 * @param {boolean} options.showLatexMenu 是否启用菜单栏的公式入口
 * @param {boolean} options.paste 是否启用粘贴功能
 * @returns {object} new config
 */
export function registerLatexPlugin(config, options = {}) {
  const setupRaw = config.setup || (() => {});
  const menu = config.menu || {};
  const showLatexMenu = options?.showLatexMenu || false;
  const paste = options?.paste || false;

  let plugins = config.plugins || "";
  let menubar = config.menubar || "";

  if (showLatexMenu) {
    menu[pluginConfig.menuKey] = pluginConfig.menu;
    if (Array.isArray(menubar)) menubar.push(pluginConfig.menuKey);
    else if (typeof menubar === "boolean" && menubar)
      menubar = pluginConfig.tinymce.allMenuBar.concat(pluginConfig.menuKey);
    else menubar = pluginConfig.tinymce.allMenuBar.concat(pluginConfig.menuKey);
  }

  // 添加 paste 插件，以支持粘贴功能
  if (paste && !plugins.includes("paste")) {
    plugins += " paste";
  }

  /**
   * @description 注册latex插件
   * @param {object} editor editor
   */
  const setup = (editor) => {
    commonRegisterHandler(editor);
    return setupRaw(editor);
  };

  return {
    ...config,
    menu,
    menubar,
    plugins,
    setup,
  };
}
