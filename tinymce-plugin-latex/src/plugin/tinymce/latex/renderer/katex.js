import katex from "katex";

export default function katexRender(latex, displayMode) {
  return katex.renderToString(latex.trim(), {
    output: "mathml",
    displayMode: displayMode,
    throwOnError: false,
  });
}
