import axios from "axios";
import config from "../../config.json";
import store from "../app/store";

const apiUrl = config.apiurl;

axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.Auth.token;

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Get = (route, params) => {
  return axios.get(apiUrl + route, { params });
};

const Post = (route, body, params) => {
  return axios.post(apiUrl + route, body, {
    params,
  });
};
const Put = (route, body, params) => {
  return axios.put(apiUrl + route, body, { params });
};
const Patch = (route, body, params) => {
  return axios.patch(apiUrl + route, body, { params });
};

const Delete = (route, params) => {
  return axios.delete(apiUrl + route, { params });
};

const http = { get: Get, post: Post, put: Put, patch: Patch, delete: Delete };
export default http;
