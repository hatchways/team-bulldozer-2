const API_URL = process.env.REACT_APP_API_URL;

export default class AuthApi {
  static login(fields) {
    return fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    });
  }

  static register(fields) {
    return fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    });
  }

  static me(fields) {
    return fetch(`${API_URL}/auth/me`, {
      method: "Get",
      credentials: "include",
    });
  }
}
