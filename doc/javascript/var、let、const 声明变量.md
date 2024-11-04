## var、let、const 声明变量

`var`、`let` 和 `const` 是 JavaScript 中用来声明变量的关键字。学习一下它们在作用域、初始化、重复声明的区别，也学习一下什么是暂时性死区、变量提升。

## 1、作用域

- `var`：使用函数作用域（function scope），在函数内声明的变量在函数外不可访问；如果在全局作用域中声明，则是全局变量。`var` 的变量会被提升到函数或全局范围的顶部。
- `let` 和 `const`：使用块作用域（block scope），在 `{}` 代码块内声明的变量在外部不可访问。它们不会被提升到块的顶部。

### 1-1 全局作用域下的区别

通过**var**或者**未写关键字**定义的全局变量和函数都会挂在 `window` 对象上。使用 `let` 和 `const` 则不会。

```JavaScript
    console.log('在全局作用域中定义变量');
    a1 = 'a1';
    var a2 = 'a2';
    let a3 = 'a3';
    const a4 = 'a4';
    var a5 = function () {};
    console.log(window.a1 + '-' + a1); //a1-a1
    console.log(window.a2 + '-' + a2); //a2-a2
    console.log(window.a3 + '-' + a3); //undefined-a3
    console.log(window.a4 + '-' + a4); //undefined-a4
    console.log(window.a5 + '-' + a5); //function () {}-function () {}
```

### 1-2 函数作用域下的区别

**未写关键字**定义的变量会挂在 window 对象上。使用关键字在函数内声明的变量在函数外不可访问。

```JavaScript
    console.log('在外部访问函数作用域中定义变量');
    function actionScope() {
        b1 = 'b1';
        var b2 = 'b2';
        let b3 = 'b3';
        const b4 = 'b4';
        var b5 = function () {};
    }
    console.log('actionScope函数执行一下，让它入栈');
    actionScope();
    console.log(window.b1); //b1
    console.log(window.b2); //undefined
    console.log(window.b3); //undefined
    console.log(window.b4); //undefined
    console.log(window.b5); //undefined
    console.log(b1); //b1
    //console.log(b2); //Uncaught ReferenceError: b2 is not defined
    //console.log(b3); //Uncaught ReferenceError: b3 is not defined
    //console.log(b4); //Uncaught ReferenceError: b4 is not defined
    console.log(b5); //Uncaught ReferenceError: b5 is not defined

```

### 2 变量初始化

- **`var`** 和 **`let`**：可以在声明时不初始化（即赋值为 `undefined`）。
- **`const`**：必须被初始化，即你必须在声明时就赋值，也不可重新赋值，对于对象或数组，`const`保证的是引用不变。
- **`let`**和**`const`**：如果块作用域存在 `let` 和 `const `命令，在声明前调用它，就会报`ReferenceError`错误。这个区块对这些命令声明的变量，从一开始就形成了封闭作用域，也称为“暂时性死区”。

```javascript
try {
  console.log('变量初始化');
  c1 = 'c1';
  var c2 = 'c2';
  let c3 = 'c3';
  const c4 = 'c4';
  var c5 = function () {};
  //const c6;//// SyntaxError: Identifier 'i' has already been declared
  const c7 = [1, 2, 3];
  const c8 = [1, 2, 3];
  const c9 = {
    name: 'simahe',
    age: 18,
  };

  c1 = 'c1-1';
  c2 = 'c2-2';
  c3 = 'c3-3';
  //c4 = 'c4-4'; //typeError: Assignment to constant variable.
  c5 = function () {
    return 1;
  };
  c7.push(4); //修改数组
  //c8 = [1, 2, 3, 4];//替换数组报错TypeError: Assignment to constant variable.
  c9.age = 16; //修改对象

  console.log(c1); //c1-1
  console.log(c2); //c2-2
  console.log(c3); //c3-3
  console.log(c4); //c4
  console.log(c5); //ƒ () {return 1;}
  console.log(c7); // [1, 2, 3, 4]
  console.log(c8); // [1, 2, 3]
  console.log(c9); // {age: 16,name: "simahe"}

  //暂时性死区
  if (true) {
    tmp = 'abc'; // ----ReferenceError: Cannot access 'tmp' before initialization
    let tmp;
  }
} catch (e) {
  console.log(e);
}
```

### 3 变量提升

`var`存在变量提升，即在声明之前就能够使用，值为 `undefined`。变量提升不适用于由`let`或者`const`关键字声明的变量，未声明前访问会得到`ReferenceError`报错。

下面是变量提升的例子：

```javascript
try {
  console.log(d1); // 输出: undefined
  var d1 = 'd1';
  console.log(d1); // 输出: d1

  console.log(d2); // 报错: ReferenceError: Cannot access 'd2' before initialization
  let d2 = 10;

  console.log(d3); // 报错: ReferenceError: Cannot access 'd3' before initialization
  const d3 = 20;
} catch (e) {
  console.log(e);
}
```

#### 3-1 为什么会存在变量提升

浏览引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。包括变量和函数在内的所有**声明都会在任何代码被执行前**首先被处理。

当你看到 `var a = 2`时，可能会认为这是一个声明。但 JavaScript 实际上会将其看成两个声明：`var a;`和 `a = 2`。第一个定义声明是在编译阶段进行的。第二个赋值声明会被留在原地等待执行阶段.

```javascript
//源代码
console.log(a); //undefined
var a = 2;

//编译之后
var a = undefined;
console.log(a);
a = 2;
```

#### 3-2 **提升的基本原则**

- 由`var`关键字声明的变量在 JavaScript 中被提升;
- 函数声明在 JavaScript 中被提升,并且优先级比`var`高, 提升只对函数声明有效，函数表达式并不能被提升。

```javascript
//源代码
b(); // 1
var b; //由`var`关键字声明
//函数声明
function b() {
  console.log(1);
}
//函数表达式
b = function () {
  console.log(2);
};

//编译之后
function b() {
  console.log(1);
}
b(); // 1
b = function () {
  console.log(2);
};
```

### 4 使用总结

- 首先，你不确定时优先使用 `const`；其次，明确知道后期该值会改变，使用 `let`；最后，`var`可放弃使用，`let` 和 `const`是用来替代`var`的;
- 至于变量**未写关键字**，可使用严格模式`'use strict';`
- 前端工程化可使用第三方插件`eslint`来检查代码

> 参考：

《JavaScript 高级程序设计第四版》

《你不知道的 JavaScript（上卷）》

《[ECMAScript 6 入门](https://es6.ruanyifeng.com/)》
