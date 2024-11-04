import { setLocalStorage, getLocalStorage } from "../utils/index.js";

import { THEME } from "../utils/cache-types.js";
setLocalStorage(THEME, "black");

let theme = getLocalStorage(THEME);
console.log(`当前主题：${theme}`);
