# JS 异步编程

在学习 js 异步编程前，我们先了解一些基本概念。

1. **什么是并发（Concurrency）**：

- 并发只是一个概念，指的是多个任务在同一时间段内进行，我们可以使用并行、多线程、异步等方案来解决并发问题。

2. **什么是并行（Parallelism）**：

- 并行指的是多个任务在同一时刻真正同时执行，需要多核处理器（CPU）或多台计算机来实现。当一个 CPU 执行一个线程时，另一个 CPU 可以执行另一个线程，两个线程互不抢占 CPU 资源，可以同时进行。

3. **进程（Process）**：

- 进程是操作系统分配资源的基本单位，是正在执行的程序的实例。每个进程都有独立的地址空间、内存和资源，进程之间的隔离性较强。

4. **线程（Thread）**：

- 线程是进程的一个执行单位，也是最小单位。一个进程可以包含多个线程，这些线程共享进程的资源，因此能够更高效地进行通信和数据共享。
  - 为什么要多线程：多个线程同时进行，提高程序的响应速度和性能；
  - 什么是线程池：预先创建多个线程，避免频繁地创建和销毁线程；
  - 什么是线程安全：使用同步机制、原子操作等，使多线程对共享资源的访问达到预期结果；

5. **同步（Synchronous）**：

- 同步是指在执行任务过程中等待一个操作完成后才能再继续执行下一个操作。

6. **异步（Asynchronous）**：

   - 异步是指一种非阻塞的执行方式。一个任务可以启动另外一个任务而不需要等待其完成，允许程序继续执行其他操作。

   - 多线程方案：一个进程中可以使用多个线程，每条线程并行执行不同的任务。

   - 单线程方案：一个线程使用**事件队列**管理多个执行的任务，让他们协同工作。

_以上属于个人理解，如有错误，请在评论区指出，共同进步！_

## JS 异步编程

JavaScript 在浏览器中是单线程的，这意味着它一次只能执行一个操作。好处是防止多个线程同时操作 DOM，带来渲染冲突问题，但也意味着如果一个操作需要较长时间，就会阻塞后续操作。

先让我们来看**同步编程**，在这里`fetchData`模拟阻塞操作。

```javascript
console.log(new Date());
function fetchData() {
  for (let i = 0; i < 2e9; i++) {}
  return '模拟阻塞操作';
}
let data = fetchData();
console.log(new Date());
console.log(data);
```

JavaScript 的异步编程是一种用来处理耗时操作（如网络请求、文件读写、定时器等）而不阻塞主线程的技术。这允许页面保持响应，提高用户体验。JavaScript 提供了多种实现异步编程的方式，包括回调函数、Promise、async/await 等。

#### 1. 回调函数 (Callback Functions)

回调函数是最基本的异步编程方式。当一个操作完成时，会调用一个函数来处理结果。

```javascript
//模拟网络请求
function fetchData(callback) {
  setTimeout(() => {
    const data = 'Callback Functions';
    callback(data);
  }, 2000);
}
//使用回调函数
fetchData((result) => {
  console.log(result); // Callback Functions
});
```

#### 2. Promise.then()

`Promise.then()` 是一种更优雅的替代回调的方法，(回调函数有嵌套问题-回调地狱）

```javascript
//模拟网络请求
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = 'Promise';
      resolve(data);
    }, 2000);
  });
}

//使用Promise
fetchData()
  .then((result) => {
    console.log(result); // Promise
  })
  .catch((error) => {
    console.error(error);
  });
```

#### 3. async/await

async/await 是基于 Promise 的语法糖，使用同步的写法。

```javascript
//模拟网络请求
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = 'async-await';
      resolve(data);
    }, 2000);
  });
}
//使用async/await
async function getData() {
  try {
    //async/await使用同步的写法
    const result = await fetchData();
    console.log(result); //async-await
  } catch (error) {
    console.error(error);
  }
}

getData();
```

## 事件循环

事件循环是 JavaScript 中处理异步操作的机制。JavaScript 是单线程的，这意味着它在任何时刻只能执行一个任务。事件循环的主要任务是监视**调用堆栈**和**任务队列**，并在调用堆栈空闲时执行队列中的异步任务。

我们在前文 [《JS 执行上下文 - V8 引擎》](https://blog.csdn.net/simahe/article/details/143472736)提到，执行上下文在创建过程中将函数加入**调用堆栈**。那么在遇到异步操作时，这些回调函数会在完成之后推入任务队列中。

#### 事件循环工作流程：

1. **调用堆栈**：每当一个函数被调用时，它被压入堆栈（后进先出（LIFO）），执行完成后则被弹出。
2. **任务队列**：当一个异步操作（如 `setTimeout`、`Promise`、事件监听等）完成时，回调函数会被推入任务队列队列（先进先出FIFO）中。
3. **事件循环**：事件循环会不断检查调用堆栈是否为空。如果堆栈为空且任务队列中有任务，它将从任务队列中取出一个任务，将其推入调用堆栈，然后执行。

这种机制允许 JavaScript 处理异步事件而不会阻塞主线程。

我们看一个示例

```javascript
console.log('Start'); // 1
//setTimeout异步操作将被推入任务队列
setTimeout(() => {
  console.log('Timeout'); // 6
}, 0);
//Promise.then()异步操作将被推入任务队列
new Promise((resolve) => {
  console.log('Promise'); // 2
  resolve();
}).then(() => {
  console.log('Promise then'); // 5
});
//函数也是同步执行的
function Func() {
  console.log('Func'); //3
}
Func();
console.log('End'); // 4

//   Start
//   Promise
//   Func
//   End
//   Promise then
//   Timeout
```

代码解析

1. `console.log('Start')` 被压入调用堆栈并执行，输出 "Start"。
2. `setTimeout` 被调用，将`setTimeout` 回调函数添加到任务队列中，并返回控制权给主线程。
3. `Promise` 被调用，输出 "Promise"。`Promise.then()`被调用，注册`Promise` 回调函数添加到任务队列中，并返回控制给主线程；
4. `Func()` 被执行，输出 "Func"。
5. `console.log('End')` 被执行，输出 "End"。
6. 主线程没有任务后，事件循环开始，首先处理 `Promise.then()` 的回调，输出 "Promise then"。
7. 最后事件循环处理 `setTimeout` 的回调，输出 "Timeout"。

通过这种方式，JavaScript 能够有效地处理异步操作并保持非阻塞性。但是您已发现`Promise.then()`为什么比`setTimeout`先执行。这就又设计到任务队列的另一个知识，宏任务和微任务。

### 任务队列类型

事件循环第一步始终从宏任务获取一个任务执行(`<script>`)。当这个宏任务执行完毕后，JavaScript 引擎会检查微任务队列并执行所有的微任务，再回到宏任务队列中取下一个宏任务。可以总结为：“每个宏任务后会执行所有微任务。”

##### 宏任务 (Macro Tasks)

- `<script>`
- `setTimeout`、`setInterval`、`setImmediate`
- `setInterval`
- I/O 操作
- `requestAnimationFrame`
- 事件监听回调函数等

每当 JavaScript 执行完一个宏任务后(`<script>`)，会检查微任务队列并执行其中所有的微任务，然后再继续下一个宏任务。

##### 微任务 (Micro Tasks)

微任务是指在宏任务执行后、事件循环的下一轮开始前需要执行的更小的任务，主要包括：

- `Promise` 的 `then`、`catch`、`finally` 回调
- `async/await`中的代码
- `Generator`函数
- `MutationObserver`
- `process.nextTick`（Node.js 环境）

微任务的定义是在当前宏任务完成后立即执行，当前执行上下文处于空闲状态时，依次执行所有的微任务，直到微任务队列为空。

## 扩展学习 Web Worker

Web Worker 是 HTML5 中引入的一项技术，用于在后台线程中执行 JavaScript，从而使得主线程可以保持响应性。Web Workers 特别适合处理计算密集型操作或执行长时间的任务，而不会阻塞 UI 线程。

Web Workers 的主要特点包括：

- **多线程**：Web Worker 允许你将 JavaScript 代码放入一个独立的线程中运行，避免对 UI 线程的阻塞，从而确保页面的响应性。
- **隔离的执行环境**：每个 Worker 都有自己的运行环境，独立于主线程。这意味着 Worker 不能直接访问 DOM 或主线程内的 JavaScript 变量，必须通过消息传递（`postMessage`）来进行通信。
- **消息传递**：使用 `postMessage` 方法，可以在主线程和 Worker 之间发送数据。接收到消息的一方使用 `onmessage` 事件处理程序来处理接收到的数据。
- **限制性**：由于安全原因，Workers 不能访问一些 Web API，如 `document`、`window` 和其他与 UI 相关的对象。此外，Worker 中的某些功能（如 localStorage 和 sessionStorage）也受限。

具体请看 [Web_Workers_API]([Web Worker API - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API))

> 参考：

《JavaScript 高级程序设计第四版》
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)