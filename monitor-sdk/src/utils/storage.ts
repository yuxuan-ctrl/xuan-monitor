import Cookies from 'js-cookie';
// cookie保存的天数
// { expires: cookieExpires || 1 }

export const setToken = (name: string, token: string, cookieExpires?: any) => {
  Cookies.set(name, token);
};

export const getToken = (name: string) => {
  const token = Cookies.get(name);
  if (token) return token;
  else return false;
};

export const delToken = (name: string) => {
  Cookies.remove(name);
};
export const clearAllCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    keys.forEach((key) => {
      Cookies.remove(key);
    });
  }
};
