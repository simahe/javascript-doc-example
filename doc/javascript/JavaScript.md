# JavaScript 学习文档

## 1、什么是 JavaScript

JavaScript 是一门用来与网页交互的脚本语言，1995 问世，主要用途是代替服务器端语言处理输入验证。完整的 JavaScript 实现包含以下几个部分：

- ECMAScript：由 ECMA-262 定义并提供核心功能。
- 文档对象模型（DOM）：提供与网页内容交互的方法和接口。
- 浏览器对象模型（BOM）：提供与浏览器交互的方法和接口

## 2、HTML 中的 JavaScript

### 2.1 `<script>`元素

内部直接使用`<script>console.log('内部直接使用');</script>`,外部调用:`<script src="./external.js"></script>`

`<script>`元素有下列 8 个属性。

- async：可选。异步加载脚本，下载完立即执行;
- charset：可选。使用 src 属性指定的代码字符集。
- crossorigin：可选。默认不使用 CORS。`crossorigin="use-credentials"`
- defer：可选。异步加载脚本，下载完等文档完全被解析和显示之后再执行。（主要使用这样）
- integrity：可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性。
- language：废弃。大多数浏览器都会忽略这个属性，不应该再使用它。
- src：可选。表示包含要执行的代码的外部文件。
- type：可选。代替 language， MIME 默认类型`"text/javascript"`，es6 类型`type="module"`

### 2.2 行内脚本与外部脚本

推荐使用**外部文件**的理由如下：

- 可维护性: 代码分散会导致维护困难,而用一个目录保存所有文件，则更容易维护。

- 缓存: 多个页面用到同一个文件，只需下载一次

- 良好的兼容性

## 3、语言基础

JavaScript 需要基础是在 ECMAScript 基础上定义的。

### 3.1 语法

- 区分大小写：`JavaScript`和`javascript`不同
- 标识符：字母、下划线（`_`）或美元符号（`$`）开头，剩下的可以为字母、`_`、`$`或数字
- 注释：`// 单行注释`, `/* 这是多行注释 */ `
- 严格模式：外部 js 文件开头写上严格模式`use strict`
- 语句:ECMAScript 中的语句以分号结尾。

### 3.2 关键字与保留字

几乎所有语言都有关键字与保留字，这些单词不能用作标识符或属性名，留着作特殊用途使用。

```
break do in typeof
case else instanceof var
catch export new void
class extends return while
const finally super with
continue for switch yield
debugger function this
default if throw
delete import try
```

### 3.3 变量

- var：定义局部变量

- let：是块作用域
- const
- 空：

### 3.4 数据类型

ECMAScript 有 6 种简单数据类型（也称为原始类型）：`Undefined`、`Null`、`Boolean`、`Number·、
`String`和`Symbol`。还有一种复杂数据类型叫 `Object`

### ECMAScript

### DOM

### BOM 对象

BOM 又称浏览器对象模型，它主要用来描述一些与浏览器行为相关的接口和方法，比如我们利用 JS 调整浏览器窗口大小、标签页跳转等等，这些都是 BOM 对象。

- window 对象：Global；
- location 对象：导航功能；
- navigator 对象：浏览器类型；
- screen 对象：浏览器大小、位置；
- history 对象，导航记录；
