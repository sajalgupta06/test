import cookie from "js-cookie";
export const isAuth = () => {
    // console.log((JSON.parse(getCookie('user'))))
    if (process.browser) {
      const cookieChecked = cookie.get("access");
      if (cookieChecked) {
          return true
      }
        else {
          return false;
        }
      }
    }
  
