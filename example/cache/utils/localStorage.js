export const setLocalStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify({ data: value }));
};

export const getLocalStorage = function (key) {
  let obj = localStorage.getItem(key);
  return !obj ? null : JSON.parse(obj).data;
};

export const deleteLocalStorage = function (key) {
  localStorage.removeItem(key);
};

export const clearLocalStorage = function () {
  localStorage.clear();
};
