import katexRender from "./renderer/katex"; //仅支持html/mathml/混合， 不支持svg
import mathjaxRender from "./renderer/mathjax"; //支持html/mathml/svg...

//此demo最终是将svg转临时路径做为img插入editor，所以不要使用katexRender
const debug = 1;
export const useRenderer = [katexRender, mathjaxRender][debug];

let activeUrls = new Set();
let formulaIndex = 0;
/**
 * 创建 LaTeX 公式节点
 *
 * @param {*} match 匹配的文本/svg html
 * @param {*} latex LaTeX 公式
 * @param {object} options options
 * @param {boolean} options.displayMode true:行间公式 false:行内公式
 * @param {boolean} options.rendered match代表的数据是否是渲染后的结果
 * @param {boolean} options.formulaId 编辑公式时复用的公式ID
 * @returns 创建的 LaTeX 公式节点
 */
export function createLatexNodeText(match, latex, options) {
  try {
    const displayMode = options?.displayMode || true;
    const matchDataRendered = options?.rendered || false;

    let formulaId = options?.formulaId;
    if (!formulaId) {
      formulaId = `formula-${++formulaIndex}-${Date.now()}`;
    }

    let renderedData = match;
    if (!matchDataRendered) {
      renderedData = useRenderer(latex.trim(), displayMode);
    }

    if (debug === 0) {
      throw new Error("katexRender不适用");
    }
    const sourcePath = createBlobUrl(renderedData);
    // 为公式添加可点击的容器和唯一标识
    return `<span 
                class="formula-box" 
                data-formula-id="${formulaId}"
                data-latex="${encodeURIComponent(latex.trim())}"
                data-raw="${encodeURIComponent(match)}"
                contenteditable="false"
                style="cursor: pointer; transition: background-color 0.2s;"
                onmouseover="this.style.backgroundColor='rgba(102, 126, 234, 0.1)'"
                onmouseout="this.style.backgroundColor='rgba(0,0,0,0)'"
              >
                <img src="${sourcePath}" style="pointer-events: none;user-select: none;" />
            </span>`;
  } catch (e) {
    console.error("latex render error:", e);
    return `<span  class="formula formula-err-block" style="color: red; cursor: help;" title="公式错误">[$$${latex}$$]</span>`;
  }
}

/**
 * 创建 Blob URL
 *
 * @param {string} data 数据
 * @param {string} type 类型
 * @returns Blob URL
 */
export const createBlobUrl = (data, type = "image/svg+xml;charset=utf-8") => {
  const blob = new Blob([data], { type });
  const sourcePath = URL.createObjectURL(blob);
  activeUrls.add(sourcePath);
  return sourcePath;
};

/**
 * 清理所有临时的 URL 对象
 */
export const clear = () => {
  activeUrls.forEach((url) => URL.revokeObjectURL(url));
  activeUrls.clear();
};

/**
 * 渲染包含 LaTeX 公式的文本
 * 支持 $...$（行内）和 $$...$$（行间）
 * 为每个公式添加可点击的样式和唯一标识
 *
 * @param {string} text 包含 LaTeX 公式的文本
 * @param {boolean} textIsOnlyLatex text 是纯 LaTeX 公式
 */
export default function renderLatex(text, textIsOnlyLatex = false) {
  if (!text) return "";
  let result = text;
  if (textIsOnlyLatex) {
    result = createLatexNodeText(`$$${result}$$`, result, true);
  } else {
    // 处理行间公式 $$...$$
    result = result.replace(/\$\$(.*?)\$\$/g, (math, latex) =>
      createLatexNodeText(math, latex, true)
    );
    // 处理行内公式 $...$
    result = result.replace(/\$([^\\$]+)\$/g, (math, latex) =>
      createLatexNodeText(math, latex, false)
    );
  }
  return result;
}

renderLatex.useRenderer = useRenderer;
renderLatex.createLatexNodeText = createLatexNodeText;
renderLatex.createBlobUrl = createBlobUrl;
renderLatex.clear = clear;
