# TechnologicalExploration
### canvas动画

1.[霓虹爱心动画](https://onethousandandtwentyfour.github.io/TechnologicalExploration/canvas/%e9%9c%93%e8%99%b9%e7%88%b1%e5%bf%83%e5%8a%a8%e7%94%bb/)

2.[地月动画](https://onethousandandtwentyfour.github.io/TechnologicalExploration/canvas/%e5%9c%b0%e6%9c%88%e5%8a%a8%e7%94%bb/)

2.[时钟动画](https://onethousandandtwentyfour.github.io/TechnologicalExploration/canvas/%e6%97%b6%e9%92%9f%e5%8a%a8%e7%94%bb/)

### 其他（待添加）

*** 
# Tailwind css

## 1. 安装

#### 	1.npm install tailwindcss

		######  导入基础样式

> 《1》__css导入__： 在__src/styles__下（可自定义）创建__default.css__文件,添加
>
> ```javascript
> @tailwind base;  
> //该样式旨在覆盖每个浏览器中的默认样式。这样，HTML中的元素在每个浏览器中将具有相同的				//默认样式。
> 
> @tailwind components; 
> 
> @tailwind utilities;
> ```
>
> 代码，该指令将不能被浏览器直接读取，因此该指令将由Tailwind CLI转换为CSS代码。直接执行
>
> ```js
> npx tailwind build src/styles/default.css -o src/styles/tailwind.css
> ```
>
> 或者 在__package.json__的__scripts__内添加__build:tailwind__指令：
>
> ```js
> "scripts": {
> "serve": "vue-cli-service serve",
> "build": "vue-cli-service build",
> "lint": "vue-cli-service lint",
> "build:tailwind":" tailwind build src/styles/default.css -o src/styles/tailwind.css"
> }
> ```
>
> 然后在终端执行 __npm run build:tailwind__指令。
>
> 最后在__main.js__中导入__tailwind.css__
>
> ```js
> import './styles/tailwind.css'
> ```

> 《2》__PostCSS插件__，可以在打包时使用postCSS的插件__PurgeCSS__简化css的体积。
>
> vue-cli已经内置了postcss工具，所以只需要安装postcss相关的插件即可在配置后使用。
>
> postcss的配置可以在package.json内配置或者单独创建postcss.config.js文件进行配置。
>
> ```//package.json内的配置项于scripts同级
> //1.package.json
> "postcss":{
> "plugins": {}
> }
> ```
>
> ```//postcss.config.js内配置
> //2.postcss.config.js
> //举例
> const autoprefixer = require('autoprefixer');
> const tailwindcss = require('tailwindcss');
> const purgecss = require('@fullhuman/postcss-purgecss');
> 
> module.exports = {
> plugins: [
> tailwindcss,
> autoprefixer,
> purgecss({
>    content: [//要过滤的文件路径
>    './components/**/*.vue',
>    './src/**/*.vue']
>  }),
> ],
> };
> ```

> __Sass__



### 2.配置

​	执行__npx tailwind init__会在项目创建__tailwind.config.js__文件，这是tailwind的配置文件。

```js
npm tailwind init tailwind.config.js --full //所有的配置项 ，tailwind.config.js可自定义
```



### 3.样式类  







****

#### Extend  

PostCSS : 原理，将css解析为树结构的数据（抽象语法树(AST树)），将解析后的数据交给在postcss注册的插件处理，将处理完毕的数据重新转换成字符串（浏览器可以解析的数据结构）

常用插件：autoprefixer  自动添加浏览器前缀
					purgeCSS 删除未使用的CSS的工具

网站：[purgeCSS](https://www.purgecss.cn/#%E7%9B%AE%E5%BD%95)




