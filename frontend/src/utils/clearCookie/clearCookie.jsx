import Cookie from "js-cookie";

export const clearCookie = (cookieName) => {
  //   document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  Cookie.remove(cookieName, { path: "/" });
};