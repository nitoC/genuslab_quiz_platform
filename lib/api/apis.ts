import axiosUser from "./axiosConfig";
import axios from "axios";

export const registerUser = async (payload: any) => {
  console.log(payload, "created user payload");
  const res = await axiosUser.post("user/gl_api/v2/create_account", payload);
  console.log(res, "created user payload");
  return res;
};
export const tokenUser = async (payload: any) => {
  console.log(payload, "token user payload");
  const res = await axiosUser.post("user/gl_api/v2/oauth/token", payload);
  console.log(res, "token user payload");
  return res;
};
export const loginUser = async (payload: any) => {
  console.log(payload, "login user payload");
  const res = await axiosUser.post("user/gl_api/v2/oauth/login", payload);
  console.log(res, "login user payload");
  return res;
};
export const getScoreHistory = async (email: string) => {
  // console.log(payload, "login user payload");
  const res = await axiosUser.post("scorehistory/gl_api/v2/history", {
    email,
  });
  console.log(res, "score history");
  return res;
};
export const getScoreTotal = async (email: string) => {
  // console.log(payload, "login user payload");
  const res = await axiosUser.post("scorehistory/gl_api/v2/total", {
    email,
  });
  console.log(res, "score history");
  return res;
};
export const getQuizNumber = async (email: string) => {
  // console.log(payload, "login user payload");
  const res = await axiosUser.post("scorehistory/gl_api/v2/histo_num", {
    email,
  });
  console.log(res, "number of quizzes");
  return res;
};
