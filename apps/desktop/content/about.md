# 优化

工程化阶段的优化和原理级别优化（即打包工具帮你做到的事情）是不一样的。

我们尽可能的避免单个文件超过300行。
状态多级嵌套，应尽可能的约束在父子级。


## 图片

大的图片（业务），使用静态http加载
小的图片（图标），打包到html页面中（base64等）
原因：小的图片加载，会导致页面不够友好。大的图片打包会导致用户加载html时间过久。

### svg

#### 🥰 采用原生svg，可以通过svgo等插件优化svg图片的大小（质量降低）
优势：多色，配置灵活
劣势：代码冗长
解决方案：svg组件封装

#### 😨 市面其他方案（iconfont）：
优势为使用方便。

unicode、fontclass方式
基于字体，会被浏览器最小限制12px，以及不支持多色
symbol
无法保证宽高比，也就是即使viewbox=“0，0，20，20”约束了宽高比，
那么在实际使用时，style=“width:50px;height:auto”，高度也无法正常变成50px





## JS打包

异步载入JS。对于优先于样式布局的代码可以通过async载入，对于业务逻辑相关的可以使用defer或type="module"。
区别在于，async虽然是异步，但一旦载入完成后会进行同步阻塞dom执行逻辑，而其余两种均等待dom解析完成后再执行逻辑。

实际做法：使用ES导入导出，打包工具就会自动帮你做tree shaking优化。

原理：
Nodejs为了解决模块化提出了CommonJS方案。
在cjs中，模块的导入导出是动态的（require）。即如果代码块不运行到这里，它也不知道会有哪些代码被使用。
而mjs的import、export是静态的，也就是打包工具可以在编译阶段，通过识别AST来判断所导入的函数是否有在当前模块中被使用。如果没有则不对其声明函数进行打包。
即：
```js
// export.js

// import.js

import test from './export.js'

function a() {
  console.log('a')
}
function b() {
  console.log('b')
}
export default { a, b }

test.a()
```
上述代码中，b不会被打包。
而如果存在副作用，即：

```js
// export.js

// import.js

import test from './export.js'

function a() {
  console.log('a')
}
function b() {
  console.log('b')
}
function c() {
  console.log('c')
}

c()
export default { a, b }

test.a()
```
则a与c都会被打包，如果我们已知c是无用代码，就可以使用/*#_PURE*/通知打包工具，前提是打包工具使用的是tarser进行代码优化。因为基于压缩工具的不同其shaking的方式可能也有所不同。






## 样式

避免重排（对形状产生影响的），减少重绘（色彩） 
合并样式文件，每个1k文件加载10次，也不如10k的文件加载一次好。

实际做法：基于postcss、配置cssnano。


详情：

http分析css是阻塞性质的，会导致css的识别延缓了dom的识别，但是浏览器没有提供对其异步加载的策略。
我们可以通过使用媒体查询的方式来伪造异步：

```html
<!-- 同步 -->
<link rel="stylesheet" href="./main.css">
<!-- 异步 -->
<link rel="stylesheet" href="./other.css" media="none" onload="this.media='all'">
```
但实际上，异步的做法可能会增加多次不可预见性的重排、重绘。
在css中，避免使用@import的做法，因为使用了模块化css之后，css的加载就变成串行的了。


上述做法都不是我们要担心的，因为编译器会帮助我们完成这些，我们只需要配置postcss即可： 
cssnano:代码压缩。
autoprefixer:浏览器适配.

