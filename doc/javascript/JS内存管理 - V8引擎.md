# JS 内存管理 - V8 引擎

JavaScript 通过自动内存管理实现内存分配和闲置资源回收。基本思路很简单,确定哪个环境变量不再使用，然后释放它占用的内存。这个过程是周期性的，垃圾回收程序每隔一定时间（或者说在代码执行过程中某个预定的收集时间）就会自动运行。

## 1、通过执行上下文来理解内存的分配和回收的

通过上一篇文章 [《JS 执行上下文 - V8 引擎》](https://blog.csdn.net/simahe/article/details/143472736)我们了解到，浏览器加载 js 文件后，浏览器的渲染进程将 JavaScript 代码交给 V8 JavaScript 引擎编译为机器码，然后开始执行。

简单的 V8 引擎处理流程：JS 源码 - 解析为 `AST` - 再生成字节码`Bytecode`- 优化编译为机器码 - 执行 - 回收。

也了解到在**解析阶段**创造的执行上下文，这个执行上下文管理 JavaScript 程序的执行过程以及变量和函数如何被解析和执行。

代码:

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

执行上下文执行过程：

- 1. V8 引擎创建一个全局执行上下文(`GEC`)，分配内存存储对象 `globalVar`，`outerFunction`;
- 2. 当执行 `outerFunction` 时，JavaScript 引擎创建一个新的执行上下文,分配内存存储 `outerVar`，`innerFunction`;
- 3. 当 `innerFunction` 被调用时，创建另一个执行上下文，分配内存存储 `innerVar`;

     在 `innerFunction` 中访问变量时：

  - `innerVar` 从自身的环境记录中获取。
  - `outerVar` 从 `outerFunction` 的环境记录中获取。
  - `globalVar` 则直接从`GEC`环境记录获取。

- 4. `innerFunction`执行完，将控制权返还给 `outerFunction`，内存回收 `innerVar`
- 5. `outerFunction`执行完，将控制权返还给`GEC`，内存回收 `outerVar`，`innerFunction`
- 6. 退出程序`globalVar`，`outerFunction`回收

## 2、V8 垃圾回收

### 2-1 内存大小

V8 不能全部使用计算机的内存。在《深入浅出 Node.js》一书中说明， 64 位系统下约为 1.4 GB，32 位系统下约为 0.7 GB。

Node 提供了 V8 中内存使用量的查看方式

```
# node -v  //v20.17.0
# node
# process.memoryUsage()
{
  rss: 30568448,      //进程的常驻内存部分
  heapTotal: 5988352, //已申请到的堆内存
  heapUsed: 4980464,  //当前使用的堆内存
  external: 2281893,
  arrayBuffers: 76033
}
```

Node 在启动时可以传递--max-old-space-size 或--max-new-space-size 来调整内存限制的大小，

```
//设置新生代、老生代内存大小，注意单位
# node --max-new-space-size=1024 test.js // 单位为KB
# node --max-old-space-size=1700 test.js // 单位为MB
```

### 2-2 V8 主要的垃圾回收算法

在自动垃圾回收的演变过程中，人们发现没有一种垃圾回收算法能够胜任所有的场景。现代的垃圾回收算法中按**对象的存活时间**将内存的垃圾回收进行不同的分代，然后分别对不同分代的内存施以更高效的算法。

**V8 的内存分代：**

- **新生代**：对象为存活时间较短的对象;
- **老生代**：对象为存活时间较长或常驻内存的对象;

V8 堆的整体大小就是新生代所用内存空间加上老生代的内存空间。这两个最大值需要在启动时就指定(看上面代码)。没有办法根据使用情况自动扩充，当内存分配过程中超过极限值时，就会引起进程出错。

#### 2-2-1 新生代中的对象使用 `Scavenge` 算法

新生代中的对象主要通过 Scavenge 算法进行垃圾回收，它将堆内存一分为二，每一部分空间称为 `semispace`。在这两个 `semispace`空间中，只有一个处于使用中，另一个处于闲置状态。在使用状态的 `semispace`空间称为 `From` 空间，处于闲置状态的空间称为 `To` 空间。

![Scavenge](https://i-blog.csdnimg.cn/direct/d2061277d8714d81b06fa85f32213098.png#pic_center)

新生代对象的分配过程：

1、先是在 `From`空间中进行分配；

2、垃圾回收将 `From`存货的对象复制到 `To` 空间，不存活的回收（如果 `To`间已经使用了超过 25%，直接晋升到老生代内存空间） ；

3、`From`空间和 `To` 空间的角色发生对换。

4、一个对象经过多次复制依然存活时，晋升到老生代内存空间。

简而言之，在垃圾回收的过程中，就是通过将存活对象在两个 `semispace` 空间之间进行复制。`Scavenge` 算法缺点：是只能使用堆内存中的一半，属于牺牲空间换取时间的算法，新生代中对象的生命周期较短，恰恰适合这个算法。

#### 2-2-2 老生代采用 标记清除 & 标记整理 算法

老生代采用标记清除（`Mark-Sweep`）和标记整理（`Mark-Compact`）的方式来进行垃圾回收。

- `Mark-Sweep`：在标记阶段遍历堆中的所有对象，并标记活着的对象，垃圾回收只清除没有被标记的对象。清除之后内存空间会出现不连续的状态，现需要分配一个大对象的情况就会提前触发垃圾回收。
  ![Mark-Sweep](https://i-blog.csdnimg.cn/direct/00b5d4451d29485ea32cccaeb37f8f1a.png#pic_center)
- `Mark-Compact`：在标记阶段标记活着的对象，将活着的对象往一端移动，移动完成后在清除。
  ![Mark-Compact](https://i-blog.csdnimg.cn/direct/e7eca37b28b149578aace6e736d2aaa6.png#pic_center)

#### 2-2-3 三种垃圾回收算法的简单对比

| 回收算法     | Scavenge           | Mark-Sweep   | Mark-Compact |
| ------------ | ------------------ | ------------ | ------------ |
| 分代         | 新生代             | 老生代       | 老生代       |
| 速度         | 最快               | 中等         | 最慢         |
| 空间开销     | 双倍空间（无碎片） | 少（有碎片） | 少（无碎片） |
| 是否移动对象 | 是                 | 否           | 是           |

其他算法：

- 引用计数：由于循环引用的问题，导致引用数永远不会变成 0，内存永远不会被释放，已放弃使用；

## 3、js 中如何避免内存泄漏

#### 3-1. 优化变量使用

尽量使用局部作用域的变量，而不是全局变量。局部变量在它们的作用域结束后会被垃圾回收。

- 优先使用 `const`，
- 明确知道后期该值会改变使用 `let`
- `var`放弃使用
- 使用严格模式`'use strict';`检查**未写关键字**造成全局变量污染
- 前端工程化可使用第三方插件`eslint`来检查代码

#### 3-2. 使用完的对象及时清理

- 清理事件监听器：在不再需要时移除 DOM 元素上的事件监听器。可以在元素被删除或不再需要时调用 `removeEventListener`。
- 清理定时器：于使用 `setTimeout` 或 `setInterval` 创建的定时器，应在不再需要时调用 `clearTimeout` 或 `clearInterval` 进行清理。
- 养成好的习惯在对象使用之后，设置为`null`

#### 3-3. 闭包

- 使用闭包时要小心，确保不会意外保持对大对象的引用。尽量避免让闭包的生命周期过长。

  ```javascript
  function createClosure() {
    let resource = new Array(1000000).fill('Memory Leak'); // 较大的对象

    return function cleanup() {
      resource = null; // 手动清理引用，有助于垃圾回收
    };
  }

  const cleanupFunction = createClosure();
  cleanupFunction(); // 在合适的时机调用来释放资源
  ```

#### 3-4. 使用 WeakMap 和 WeakSet

- 当使用对象作为键（map）或值（set）时，可以使用 `WeakMap` 和 `WeakSet`。它们不会阻止垃圾回收，因此适用于缓存和存储。

  ```javascript
  //vue3中多个对象依赖收集使用片段
  let targetMap = new WeakMap();
  const targer = { foo: 1, bar: 2 };
  targetMap.set(targer, targetMap.get(targer));
  // targer被垃圾回收后，targetMap中的引用也会消失
  ```

> 参考：

《JavaScript 高级程序设计第四版》
《深入浅出 Node.js》
