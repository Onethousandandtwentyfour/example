const path = require("path");
const { defineConfig } = require("@vue/cli-service");
const copyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new copyPlugin({
        patterns: [
          //tinymce编辑器加载本地包适用
          {
            from: path.resolve(__dirname, "node_modules/tinymce/icons"),
            to: "tinymce/icons",
          },
          {
            from: path.resolve(__dirname, "node_modules/tinymce/plugins"),
            to: "tinymce/plugins",
          },
          {
            from: path.resolve(__dirname, "node_modules/tinymce/skins"),
            to: "tinymce/skins",
          },
          {
            from: path.resolve(__dirname, "node_modules/tinymce/themes"),
            to: "tinymce/themes",
          },
          //使用mathlive的math-field组件时加载对应其使用的静态资源（字体，音频等）
          {
            from: path.resolve(__dirname, "node_modules/mathlive/dist/fonts"),
            to: "js/fonts",
          },
          {
            from: path.resolve(__dirname, "node_modules/mathlive/dist/sounds"),
            to: "js/sounds",
          },
        ],
      }),
    ],
    resolve: {
      fallback: {
        // 告诉 Webpack：这些 Node.js 模块在浏览器中不存在，不要尝试加载
        path: false,
        fs: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        // 如果还有其他报错模块，也加在这里
      },
    },
  },
});
