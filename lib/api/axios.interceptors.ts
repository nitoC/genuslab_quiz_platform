import axios from "axios";
import { axiosUser } from "./axiosConfig";

axiosUser.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    console.log("Request Interceptor: User from localStorage:", user);
    const token = user ? JSON.parse(user).accessToken : null;
    console.log("Request Interceptor: Token extracted:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosUser.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axiosUser };
