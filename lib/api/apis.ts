// import axiosUser from "./axiosConfig";
// import axios from "axios";

// export const registerUser = async (payload: any) => {
//   console.log(payload, "created user payload");
//   const res = await axiosUser.post("user/gl_api/v2/create_account", payload);
//   console.log(res, "created user payload");
//   return res;
// };
// export const tokenUser = async (payload: any) => {
//   console.log(payload, "token user payload");
//   const res = await axios.post(
//     "https://genuslab.online/user/gl_api/v2/oauth/token",
//     payload,
//   );
//   console.log(res, "token user payload");
//   return res;
// };
// export const loginUser = async (payload: any) => {
//   console.log(payload, "login user payload");
//   const res = await axios.post("user/gl_api/v2/oauth/login", payload);
//   console.log(res, "login user payload");
//   return res;
// };
// export const getScoreHistory = async (email: string) => {
//   // console.log(payload, "login user payload");
//   const res = await axiosUser.post("scorehistory/gl_api/v2/history", {
//     email,
//   });
//   console.log(res, "score history");
//   return res;
// };
// export const getScoreTotal = async (email: string) => {
//   // console.log(payload, "login user payload");
//   const res = await axiosUser.post("scorehistory/gl_api/v2/total", {
//     email,
//   });
//   console.log(res, "score history");
//   return res;
// };
// export const getQuizNumber = async (email: string) => {
//   // console.log(payload, "login user payload");
//   const res = await axiosUser.post("scorehistory/gl_api/v2/histo_num", {
//     email,
//   });
//   console.log(res, "number of quizzes");
//   return res;
// };
import { axiosSystem } from "./axiosConfig";
import { axiosUser } from "./axios.interceptors";
import axios from "axios";
import { IQuestionSubmit } from "@/interfaces";

export const registerUser = async (payload: any) => {
  console.log(payload, "created user payload");
  const res = await axiosSystem.post("auth/register", payload);
  console.log(res, "created user payload");
  return res;
};
export const tokenUser = async (payload: any) => {
  console.log(payload, "token user payload");
  const res = await axios.post(
    "https://genuslab.online/user/gl_api/v2/oauth/token",
    payload,
  );
  console.log(res, "token user payload");
  return res;
};
export const loginUser = async (payload: any) => {
  console.log(payload, "login user payload");
  const res = await axiosSystem.post("auth/login", payload);
  console.log(res, "login user payload");
  return res;
};

export const getUserProfile = async (id: string) => {
  console.log(id, "get user profile id");
  const res = await axiosUser.get(`user/profile/${id}`);
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

export const getRankData = async () => {
  const res = await axiosUser.get("rank/all");
  console.log(res, "rank data");
  return res;
};

//admin endpoints
export const adminLogin = async (payload: any) => {
  console.log(payload, "admin login payload");
  const res = await axiosSystem.post("auth/admin/login", payload);
  console.log(res, "admin login response");
  return res;
};

export const createQuiz = async (payload: any) => {
  console.log(payload, "create quiz payload");
  const res = await axiosUser.post("quiz/seed", payload);
  console.log(res, "create quiz response");
  return res;
};

export const getDemoResult = async (payload: any) => {
  const res = await axiosUser.post("demo/result", payload);

  console.log(res, "submit data");
  return res;
};
export const getDemoQuestions = async () => {
  const res = await axiosUser.get("demo/quiz");

  // console.log(res);
  return res;
};
export const createQuestion = async (payload: IQuestionSubmit[]) => {
  const res = await axiosUser.post("question/seed", payload);
  return res;
};
export const updateQuiz = async (id: string, payload: any) => {
  console.log(id, "update quiz id");
  const res = await axiosUser.put(`quiz/update/${id}`, payload);
  console.log(res, "update quiz response");
  return res;
};

export const getSlotDetails = async () => {
  const res = await axiosSystem.get(`system/quiz-slots`);
  console.log(res, "fetch slot details response");
  return res;
};
export const getEpisodeDetails = async () => {
  const res = await axiosSystem.get(`system/episode-slots`);
  console.log(res, "fetch episode details response");
  return res;
};

export const fetchQuizDetails = async (id: string) => {
  console.log(id, "fetch quiz details id");
  const res = await axiosUser.get(`quiz/${id}`);
  console.log(res, "fetch quiz details response");
  return res;
};

export const deleteQuiz = async (id: string) => {
  console.log(id, "delete quiz id");
  const res = await axiosUser.delete(`quiz/${id}`);
  console.log(res, "delete quiz response");
  return res;
};

export const fetchQuestionDetails = async (id: string) => {
  console.log(id, "fetch question details id");
  const res = await axiosUser.get(`question/${id}`);
  console.log(res, "fetch question details response");
  return res;
};

export const fetchQuizQuestions = async (id: string) => {
  console.log(id, "fetch quiz questions details id");
  const res = await axiosUser.get(`quiz/questions/${id}`);
  console.log(res, "fetch quiz questions details response");
  return res;
};
//system endpoints
export const getTime = async () => {
  const res = await axiosSystem.get("system/time");
  console.log(res, "system time response");
  return res;
};

//general endpoints

const getRankings = async () => {
  const res = await axiosUser.get("rank/all");
  console.log(res, "rankings response");
  return res;
};
