import axios from "axios";
const live = true;
const axiosUser = axios.create({
  baseURL: live
    ? "https://glsrv.cloud/"
    : "http://172.105.42.17:4000/user/gl_api/v2",
});

export default axiosUser;
