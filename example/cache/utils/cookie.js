import Cookies from "js-cookie";

export function setCookie(CookieKey, CookieValue) {
  return Cookies.set(CookieKey, CookieValue);
}

export function getCookie(CookieKey) {
  return Cookies.getJSON(CookieKey);
}

export function removeCookie(CookieKey) {
  return Cookies.remove(CookieKey);
}

export const clearCookie = function () {
  for (let key of Object.keys(Cookies.get())) {
    if (key.startsWith("CLIENT_")) {
      Cookies.remove(key);
    }
  }
};
