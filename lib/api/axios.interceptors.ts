import axios, { AxiosInstance } from "axios";
import { axiosUser, axiosAdmin, axiosSystem } from "./axiosConfig";
import toast from "react-hot-toast";
import { useUser } from "@/store/useUser";
import { useAdminUser } from "@/store/useAdminUser";

// axiosUser.interceptors.request.use(
//   (config) => {
//     const user = localStorage.getItem("user");
//     console.log("Request Interceptor: User from localStorage:", user);
//     const token = user ? JSON.parse(user).accessToken : null;
//     console.log("Request Interceptor: Token extracted:", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// axiosUser.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error?.response?.status === 403) {
//       toast.error(
//         "user lacks the neccessary permisions to perform this operation",
//       );
//     }
//     if (error?.response?.status === 401) {
//       console.log(error.response, "error");
//       toast.error("user unauthorised");
//       window.location.href = "/login";
//     }
//     console.log(error, "error");
//     return Promise.reject(error);
//   },
// );

// //admin routes

// axiosAdmin.interceptors.request.use(
//   (config) => {
//     const user = localStorage.getItem("admin");
//     console.log(user, "admin token");
//     console.log("Request Interceptor: Admin from localStorage:", user);
//     const token = user ? JSON.parse(user).accessToken : null;
//     console.log("Request Interceptor: Token extracted:", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(config, "config ass");
//     return config;
//   },
//   (error) => {
//     console.log(error, "in axios");
//     if (error?.response?.status === 403) {
//       toast.error(
//         "user lacks the neccessary permisions to perform this operation",
//       );
//     }
//     if (error?.response?.status === 401) {
//       toast.error(
//         "user lacks the neccessary permisions to perform this operation",
//       );

//       toast.error("user unauthorised");
//       window.location.href = "genuslab/admin";
//     }
//     return Promise.reject(error);
//   },
// );

// axiosUser.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const response = await axiosUser.post(
//           "/auth/refresh",
//         );

//         const newAccessToken = response.data.accessToken;

//         useAuthStore
//           .getState()
//           .setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization =
//           `Bearer ${newAccessToken}`;

//         return axiosUser(originalRequest);
//       } catch (refreshError) {
//         useAuthStore.getState().clearAuth();

//         window.location.href = "/login";

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// Two fully independent refresh flows — separate in-flight-request guards,
// separate cookies/endpoints, separate stores — so refreshing an admin
// session's token can never clobber (or be clobbered by) a concurrent
// client session's token in the same browser.
let userRefreshPromise: Promise<string> | null = null;
let adminRefreshPromise: Promise<string> | null = null;

const refreshUserAccessToken = async (): Promise<string> => {
  if (!userRefreshPromise) {
    userRefreshPromise = axiosSystem
      .post("/auth/refresh")
      .then((response) => {
        const newAccessToken = response.data.accessToken;
        useUser.getState().updateUser(response.data);
        return newAccessToken;
      })
      .finally(() => {
        userRefreshPromise = null;
      });
  }

  return userRefreshPromise;
};

const refreshAdminAccessToken = async (): Promise<string> => {
  if (!adminRefreshPromise) {
    adminRefreshPromise = axiosSystem
      .post("/auth/admin/refresh")
      .then((response) => {
        const newAccessToken = response.data.accessToken;
        useAdminUser.getState().updateUser(response.data);
        return newAccessToken;
      })
      .finally(() => {
        adminRefreshPromise = null;
      });
  }

  return adminRefreshPromise;
};

const requestInterceptor = async (
  axiosInstance: AxiosInstance,
  type: "user" | "admin",
) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const storedUser =
        type === "admin" ? useAdminUser.getState().user : useUser.getState().user;

      if (storedUser?.accessToken) {
        config.headers.Authorization = `Bearer ${storedUser.accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

const responseInterceptor = async (
  axiosInstance: AxiosInstance,
  type: "user" | "admin",
) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken =
            type === "admin"
              ? await refreshAdminAccessToken()
              : await refreshUserAccessToken();

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (err) {
          if (type === "admin") {
            useAdminUser.getState().logout();
            toast.error("user unauthorised");
            window.location.href = "/genuslab/admin";
          } else {
            useUser.getState().logout();
            toast.error("user unauthorised");
            window.location.href = "/login";
          }
          return Promise.reject(err);
        }
      }
      // 403 → authenticated but not authorized
      if (error.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");

        return Promise.reject(error);
      }

      // Everything else
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

requestInterceptor(axiosUser, "user");
requestInterceptor(axiosAdmin, "admin");
responseInterceptor(axiosUser, "user");
responseInterceptor(axiosAdmin, "admin");

export { axiosUser, axiosAdmin };
