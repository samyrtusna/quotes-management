import http from "./httpService";

const signup = (newObject) => {
  return http.post("/auth/signup/", newObject);
};

const login = (newObject) => {
  return http.post("/auth/login/", newObject);
};

const logout = (data, config) => {
  return http.post("/auth/logout/", { token: data.token }, config);
};

export default {
  signup,
  login,
  logout,
};
