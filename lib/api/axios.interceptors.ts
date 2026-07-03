import axios from "axios";
import { axiosUser, axiosAdmin } from "./axiosConfig";
import toast from "react-hot-toast";

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
    if (error?.response?.status === 403) {
      toast.error(
        "user lacks the neccessary permisions to perform this operation",
      );
    }
    if (error?.response?.status === 403) {
      toast.error("user unauthorised");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//admin routes

axiosAdmin.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("admin");
    console.log(user, "admin token");
    console.log("Request Interceptor: Admin from localStorage:", user);
    const token = user ? JSON.parse(user).accessToken : null;
    console.log("Request Interceptor: Token extracted:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config, "config ass");
    return config;
  },
  (error) => {
    console.log(error, "in axios");
    if (error?.response?.status === 403) {
      toast.error(
        "user lacks the neccessary permisions to perform this operation",
      );
    }
    return Promise.reject(error);
  },
);

export { axiosUser, axiosAdmin };
