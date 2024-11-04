export const setSessionStorage = function (key, value) {
  sessionStorage.setItem(key, JSON.stringify({ data: value }));
};

export const getSessionStorage = function (key) {
  let obj = sessionStorage.getItem(key);
  return !obj ? null : JSON.parse(obj).data;
};

export const deleteSessionStorage = function (key) {
  sessionStorage.removeItem(key);
};

export const clearSessionStorage = function () {
  sessionStorage.clear();
};
