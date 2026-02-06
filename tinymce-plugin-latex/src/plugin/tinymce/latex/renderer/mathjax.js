// 加载 MathJax js
const loadMathJax = () => {
  return new Promise((resolve, reject) => {
    if (window.MathJax?.startup?.promise) {
      return window.MathJax.startup.promise.then(resolve);
    }
    window.MathJax = {
      //加载扩展
      loader: { load: ["input/tex-full"] },
      //启用扩展
      tex: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"],
        ],
      },
      svg: {
        // "global"：会把字体定义放在 <defs> 中，并通过 url(#...) 引用，在 <img> 中可能失效；
        // "local"：每个 SVG 自包含所有路径和样式，完全独立，适合转图片。
        fontCache: "local", // 使用global会导致img无法正常显示svg内引用样式，导致img显示"空白"
        useFontCache: false, // MathJax 3.2+ 选项
        addMML: false, // 不添加 MathML
      },
      startup: {
        // 禁用自动查找页面中的数学公式（因为我们只用 API）
        ready() {
          // 手动完成启动
          window.MathJax.startup.defaultReady();
          resolve();
        },
      },
    };

    // 加载 MathJax 脚本
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    script.onerror = () => {
      reject(new Error("Failed to load MathJax"));
    };
    document.head.appendChild(script);
  });
};
await loadMathJax(); // 等待 MathJax 初始化完成
//单个执行(为什么用tex2svgPromise而不是tex2svg，如果公式中存在\textcolor、\color等扩展命令，mathjax会创建新的script标签来加载，这个过程异步导致tex2svg执行结果不正确)
export default (latex, displayMode = false) => {
  const t = window.MathJax.tex2svg(latex, {
    display: displayMode,
    em: 16,
    ex: 8,
    containerWidth: 50 * 16,
  });
  return t.firstChild.outerHTML;
};
