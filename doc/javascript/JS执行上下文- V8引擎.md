# JS 执行上下文- V8 引擎

## 1、浏览器是怎么处理 js 文件的

当用户输入 `URL` 并访问网页时，浏览器会向服务器发送 `HTTP` 请求。服务器返回 `HTML`、`CSS`、`JavaScript` 等资源。当浏览器遇到 `<script>` 标签时，浏览器会暂停 `DOM` 的构建，并处理 `JavaScript`代码。我们编写的 `JavaScript `代码只是一个源码，电脑 CPU 只认得机器码（0 和 1）是无法执行 `JavaScript` 源码的，浏览器的渲染进程会将代码交给 **JavaScript 引擎**处理，将 `JavaScript`原码编译为机器码，然后开始执行。目前 `JavaScript` 主流引擎如下：

- **`‌V8`**：由 ‌Google 开发，主要用于 Chrome 浏览器和 ‌Node.js;
- **`SpiderMonkey`**：由 ‌Mozilla 开发，主要用于 Firefox 浏览器;
- **`JavaScriptCore`**：是 WebKit 浏览器引擎的一部分，主要用于 Safari 浏览器;

## 2、V8 引擎是怎么处理 js 的

V8 是现在最主流的，用`C++`编写的高性能 JavaScript 引擎，主要是用于提升`JavaScript `执行速度，优化内存管理等。下面是 V8 引擎处理流程：

- **解析 (Parsing)**：通过**词法分析(Lexical Analysis)**将源代码分解为一系列 tokens。在通过**语法分析(Syntax Analysis)**根据语法规则将 tokens 解析为**抽象语法树（AST）**。
- **生成字节码 (Bytecode Generation)**：在解析完成后，Ignition（V8 的解释器） 会将 AST 转换为**字节码**。
- **优化编译 (Optimizing Compilation)**：在代码执行过程中，TurboFan（v8 的优化编译器） 会监控代码的性能，将部分代码编译为更高效的**机器码**。
- **执行 (Execution))**：经优化的机器码会被执行。
- **垃圾回收 (Garbage Collection)**：负责管理内存，确保执行完不再使用的对象能够被及时回收。

#### 2.1 下面我们看一段伪代码

源码

```JavaScript
console.log(a);
var a = 2;
```

将源代码通过词法分析等到一系列 tokens

```JavaScript
Token(type='Identifier', value='console')
Token(type='Punctuator', value='.')
Token(type='Identifier', value='log')
Token(type='Punctuator', value='(')
Token(type='Identifier', value='a')
Token(type='Punctuator', value=')')
Token(type='Punctuator', value=';')
Token(type='Keyword', value='var')
Token(type='Identifier', value='a')
Token(type='Punctuator', value='=')
Token(type='Literal', value='2')
Token(type='Punctuator', value=';')
```

再将 tokens 语法分析得到抽象语法树（AST）

```JavaScript
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "name": "log"
          },
          "computed": false
        },
        "arguments": [
          {
            "type": "Identifier",
            "name": "a"
          }
        ]
      }
    },
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "value": 2,
            "raw": "2"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "script"
}
```

会将 AST 转换为**字节码**

```JavaScript
0:  LDA global.console         // Load global.console
1:  LDA global.console.log     // Load global.console.log
2:  LDA variable.a             // Load variable 'a'
3:  CALL 2                     // Call the function with 1 argument
4:  VAR a                      // Declare variable 'a'
5:  LIT 2                      // Load literal value 2
6:  STA variable.a             // Store the value 2 into variable 'a'
```

最后再转为**机器码**

```JavaScript
MOV RAX, [RIP + console]         // Load address of console
MOV RBX, [RAX + log]             // Load address of console.log
MOV RCX, [RIP + a]               // Load variable a
CALL RBX                          // Call console.log(a)
MOV [RIP + a], 2                  // Store 2 into variable a
```

最后执行

```JavaScript
var a=undefined;
console.log(a);
a = 2;
```

通过上面的伪代码，我们可以了解一般编译器的执行过程。推荐学习一下轻量级的 js 编译器[Babel](https://babeljs.io/docs/)

### 3、什么是执行上下文

执行上下文是在 JavaScript 引擎**解析 (Parsing)** 阶段，确切说是**词法分析(Lexical Analysis)**阶段，创造的一个特殊的环境。用来处理 JavaScript 代码中的**变量和函数**如何被解析和执行。这个特殊的环境被称为执行上下文。

执行上下文又分为**全局执行上下文（Global Execution Context GEC）**和**函数执行上下文（Function Execution Context FEC）**。当 JavaScript 文件被加载时，首先创建 全局上下文。 当一个函数被调用时，会创建一个函数上下文。

每个函数调用都有自己的上下文。当代码执行流进入函数时，函数的上下文被推到一个上下文栈上。 在函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文。ECMAScript 程序的执行流就是通过这个上下文栈进行控制的。

```javascript
let stack = ['GEC']; // 定义一个数组用来模拟栈
// 用数组的Push方法模式入栈
stack.push('FEC_1');
stack.push('FEC_2');
stack.push('FEC_3');
console.log(stack); // ['GEC', 'FEC_1', 'FEC_2', 'FEC_3']
// 用数组的pop方法模拟出栈
const FEC_1 = stack.pop(); //FEC_3
const FEC_2 = stack.pop(); //FEC_2
const FEC_3 = stack.pop(); //FEC_1
const GEC = stack.pop(); //GEC
```

#### 3-1 执行上下文的生命周期

- 创建阶段：创建变量对象**Variable Object (VO)**、**作用域链（ Scope Chain）**以及确定 **this 指向**。此时，所有的变量和函数声明都被预处理。
- 执行阶段：在执行阶段，JavaScript 引擎会再次读取执行上下文，并用实际值更新 VO。编译器再把代码编译为计算机可执行的机器码后执行。
- 销毁阶段：执行上下文执行完将被销毁，相关的内存将被释放。

### 3-2 执行上下文组成部分

es6 之前，创建执行上下文包括三个部分:

- 变量对象（`VO`）
- 作用域链（`ScopeChain`）
- `this`指向

```
//在全局执行上下文中
GEC={
	VO:{
		//变量和函数声明存储在内存中，优先于执行代码的过程被称为提升
		var sss=undefined;
		function(){}
	},
	scopeChain:[]，
	this:在浏览器中指向window对象
}
//在FEC_3函中执行上下文中
FEC_3={
	//全局里面叫VO，function里面是arguments
	arguments: {
	    //内部变量和函数
		var...
		function...
	},
    scopeChain: [VO('FEC_3'), VO('FEC_2'),  VO('FEC_1'),VO(global)],
    this:指向取决于函数的直接调用位置。
}
```

es6 之后，多了 `let`、`const`，`class` 等，他们使用 `window.`找不到,执行上下文内容做了修改补充。

ES6 执行上下文也包含三个主要部分：

- **变量环境（Variable Environment）**:用于存储在执行上下文中的所有变量和函数声明（var、function）。
- **词法环境（Lexical Environment）**:
- 1. **环境记录（Environment Record）**：存储当前词法环境中的变量和函数的名称和地址(let、const、class)。
  - 2. **外部词法环境的引用（Outer Lexical Environment Reference）**：引用外部词法环境，以形成作用域链。通过这个引用，当前环境能够访问外部（上一级）词法环境中的变量。
- **`This Binding` 绑定**: 每个执行上下文都有一个 `this` 值。在全局上下文中，`this` 指向全局对象；在函数上下文中，`this` 的指向取决于函数的直接调用位置。

```
//全局上下文
GlobalExectionContext = {
  //**var变量环境
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      c: undefined,  //var初始化为undefined
    }
    outer: <null> //全局上下文 空引用
  }
  //词法环境,let.const,class等
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      a: < uninitialized >,//let,const 未初始化
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>//全局上下文 空引用
  },
  ThisBinding: <Global Object>,//浏览器this绑定到window

}
//函数上下文
FunctionExectionContext = {
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      g: undefined //var初始化为undefined
    },
    outer: <GlobalLexicalEnvironment>//外部词法环境的引用，理解为作用域链
  }
   LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      Arguments: {}, //函参argument是一个类数组
    },
    outer: <GlobalLexicalEnvironment>//外部词法环境的引用，理解为作用域链
  },
  ThisBinding: <Global Object>,//this的指向取决于函数的直接调用位置

}
```

很多文章、书籍，在讲执行上下文时，有的讲变量对象，有的讲环境对象，都没错，找一个比较简单，你容易理解的来了解。毕竟 ECMAScript 还在升级中...。

一段代码：

```
let globalVar = "I am global";

function outerFunction() {
    let outerVar = "I am from outer function";

    function innerFunction() {
        let innerVar = "I am from inner function";
        console.log(globalVar); // 访问外部词法环境中的变量
        console.log(outerVar);   // 访问外部词法环境中的变量
        console.log(innerVar);   // 访问自身的环境记录中的变量
    }
    innerFunction();
}
outerFunction();
```

上述代码中：

1. 当执行 `outerFunction` 时，JavaScript 引擎创建一个新的执行上下文。
2. 在 `outerFunction` 的上下文中，创建一个词法环境，环境记录中包含 `outerVar` 的绑定，同时指向全局环境（因 `outerFunction` 内部函数的引用）。
3. 当 `innerFunction` 被调用时，创建另一个执行上下文，另一个词法环境被创建，与其环境记录和外部环境的引用（指向 `outerFunction` 的环境）一起组成。

在 `innerFunction` 中访问变量时：

- `innerVar` 从自身的环境记录中获取。
- `outerVar` 从 `outerFunction` 的环境记录中获取。
- `globalVar` 则直接从全局环境获取。

## 名称解释

- **什么是执行上下文**：JavaScript 执行阶段，创造的一个特殊的环境。用来处理 JavaScript 代码中的变量和函数如何被解析和执行。这个特殊的环境被称为执行上下文。
- **什么是作用域**：作用域是所有程序都有的一套规则，它决定了变量和函数的可访问性和生存周期。
- **什么是作用域链**：是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。
- **什么是变量提升**：执行上下文不同阶段，执行上下文创建阶段会将 function、var 定义的变量初始化，再在执行阶段赋值。
- **什么是闭包**：当一个函数引用了其声明作用域外的变量时，就形成了闭包。闭包允许函数在其声明的作用域之外记住和访问这些变量。

  > 参考：

《JavaScript 高级程序设计第四版》
[《JavaScript Execution Context》](https://www.freecodecamp.org/news/execution-context-how-javascript-works-behind-the-scenes/)

[理解 Javascript 执行上下文和执行栈](https://github.com/yued-fe/y-translation/blob/master/en/understanding-execution-context-and-execution-stack-in-javascript.md)
