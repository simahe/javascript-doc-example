# ES6 反射对象Reflect 

ES6（ECMAScript 2015）引入了一个新的内置对象，称为 `Reflect`。`Reflect` 对象提供了一些方法，用于拦截 JavaScript 操作，类似于代理，但也可用于其他反射操作。它提供的方法允许您执行诸如检索属性描述符、定义属性和调用函数等操作。

### 常用的 Reflect 方法

1. **`Reflect.apply(target, thisArgument, argumentsList)`**
   
   - 使用给定的 `this` 值和以数组形式提供的参数调用一个函数。
   ```javascript
   function greet(greeting, punctuation) {
       return `${greeting}, ${this.name}${punctuation}`;
}
   
   const person = { name: 'Alice' };
   console.log(Reflect.apply(greet, person, ['Hello', '!'])); // "Hello, Alice!"
   ```
```
   
2. **`Reflect.construct(target, argumentsList[, newTarget])`**
   - 调用构造函数并返回该对象的新实例。
   ```javascript
   function Person(name) {
       this.name = name;
   }

   const person = Reflect.construct(Person, ['Bob']);
   console.log(person.name); // "Bob"
```

3. **`Reflect.get(target, propertyKey[, receiver])`**
   - 从对象中检索属性的值。
   ```javascript
   const obj = { a: 1, b: 2 };
   console.log(Reflect.get(obj, 'a')); // 1
   ```

4. **`Reflect.set(target, propertyKey, value[, receiver])`**
   - 设置对象上属性的值。
   ```javascript
   const obj = { a: 1 };
   Reflect.set(obj, 'a', 2);
   console.log(obj.a); // 2
   ```

5. **`Reflect.has(target, propertyKey)`**
   - 确定对象中是否存在某个属性。
   ```javascript
   const obj = { key: 'value' };
   console.log(Reflect.has(obj, 'key')); // true
   ```

6. **`Reflect.deleteProperty(target, propertyKey)`**
   - 从对象中删除一个属性。
   ```javascript
   const obj = { key: 'value' };
   Reflect.deleteProperty(obj, 'key');
   console.log(Reflect.has(obj, 'key')); // false
   ```

7. **`Reflect.defineProperty(target, propertyKey, attributes)`**
   - 类似于 `Object.defineProperty`，但返回一个布尔值，表示操作是否成功。
   ```javascript
   const obj = {};
   Reflect.defineProperty(obj, 'newProp', {
       value: 42,
       writable: true
   });
   console.log(obj.newProp); // 42
   ```

8. **`Reflect.ownKeys(target)`**
   - 返回目标对象自身属性的键数组（包括不可枚举的键）。
   ```javascript
   const obj = { a: 1, [Symbol('b')]: 2 };
   console.log(Reflect.ownKeys(obj)); // ["a", Symbol(b)]
   ```

### 为什么使用 Reflect？

- **清晰性和一致性**：`Reflect` 中的方法往往比 `Object` 中的对应方法更一致和可预测。例如，`Reflect.set` 在成功设置属性时返回 `true` 或 `false`，而 `Object.defineProperty` 在失败时可能会抛出错误。
- **代理兼容性**：`Reflect` 方法常与代理一起使用，以增强其功能。
- **易用性**：与直接操作对象相比，它提供了对反射操作更函数化的处理方式。

`Reflect` API 在元编程、调试和创建高级抽象方面特别有用。