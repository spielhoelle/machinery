import decode from "jwt-decode";
import { url } from "./api";

let AuthSingleton = (function() {
  let instance;

  function createInstance() {
    return new AuthService();
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  };
})();
class AuthService {
  constructor() {
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.checkResponse = this.checkResponse.bind(this);
    this.refreshToken = this.refreshToken.bind(this);

    setInterval(() => this.refreshToken(), 60000);
  }

  login(email, password) {
    return this.fetch(`${url}/api/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }).then(response => {

      this.setToken(response.user.token);

      return Promise.resolve(response);
    });
  }

  loggedIn() {
    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);
  }
  isTokenExpired(token) {
    try {
      const decoded = decode(token);

      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }
  logOut = () => {

    localStorage.removeItem("id_token");
    //this.setState({ user: null })
    //   window.history.pushState(null, null, '/')
    window.location.href = window.location.origin + "/admin";
  };

  setToken(token) {

    localStorage.setItem("id_token", token);
  }
  getToken() {
    return localStorage.getItem("id_token");
  }
  getTokenExpiration(token) {
    if (null !== token) {
      const decoded = decode(token);

      return parseInt(decoded.exp, 10);
    }
    return 0;
  }
  refreshToken() {
    if (!this.loggedIn()) {
      return;
    }
    let now = Date.now() / 1000;
    let expire = this.getTokenExpiration(this.getToken());
    let limit = 600;

    if (now >= expire - limit) {
      return this.fetch(`${url}/api/users/refresh_token`).then(response => {
        if (response.user.token !== undefined) {
          this.setToken(response.user.token);
        }

        return Promise.resolve(response);
      });
    }
  }
  getProfile() {
    // console.log('this.getToken()', decode(this.getToken()));
    
    return decode(this.getToken());
  }
  fetch(url, options) {
    let headers = {
      Accept: "multipart/form-data",
      'Content-Type': 'multipart/form-data'
    };

    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, { headers, ...options })
      .then(this.checkResponse)
      .then(response => response.json());
  }
  checkResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return response.json().then(data => {
        let error = new Error();
        error.message = data.error.message
          ? data.error.message
          : "Unknown error";
        error.code = data.error.code;
        error.response = response;

        throw error;
      });
    }
  }
}

export default AuthSingleton;
