export default class AuthApi {
  static login(fields) {
    return fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    });
  }

  static register(fields) {
    return fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    });
  }

  static me(fields) {
    return fetch("/auth/me", {
      method: "Get",
      credentials: "include",
    });
  }
}
