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
import { axiosUser, axiosAdmin } from "./axios.interceptors";
import axios from "axios";
import { IQuestionSubmit, IUserDetails } from "@/interfaces";
import { QuizObject } from "@/app/genuslab/(dashboard)/quizzes/create-quiz/json/live/page";

//USER ENDPOINTS
export const registerUser = async (payload: any) => {
  console.log(payload, "created user payload");
  const res = await axiosSystem.post("auth/register", payload);
  console.log(res, "created user payload");
  return res;
};
// export const tokenUser = async (payload: any) => {
//   console.log(payload, "token user payload");
//   const res = await axios.post(
//     "https://genuslab.online/user/gl_api/v2/oauth/token",
//     payload,
//   );
//   console.log(res, "token user payload");
//   return res;
// };
export const loginUser = async (payload: any) => {
  console.log(payload, "login user payload");
  const res = await axiosSystem.post("auth/login", payload);
  console.log(res, "login user payload");
  return res;
};

export const getOtp = async (email: string) => {
  const res = await axiosUser.post("otp/get-otp", { email });
  return res;
};
export const verifyEmail = async (email: string, otp: string) => {
  const res = await axiosUser.post("otp/verify", { email, otp });
  return res;
};
export const verifyToken = async (otp: string) => {
  const res = await axiosSystem.post("otp/verify-token", { token: otp });
  return res;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosSystem.post("otp/forgot-password", { email });
  return res;
};

export const logout = async () => {
  const res = await axiosUser.delete("auth/logout");
  return res;
};

export const resetPassword = async (password: string, token: string) => {
  const res = await axiosUser.patch("auth/reset-password", {
    password,
    token,
  });
  return res;
};

export const getUserProfile = async (id: string) => {
  console.log(id, "get user profile id");
  const res = await axiosUser.get(`user/profile/${id}`);
  return res;
};

export const getUserDetails = async (id: string) => {
  const res = await axiosUser.get(`user-details/${id}`);
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

export const getQuizSession = async (id: string, userDetailsId: string) => {
  const res = await axiosUser.get(`quiz/session/${id}?did=${userDetailsId}`);
  console.log(res, "session created");
  return res;
};

export const getDemoResult = async (payload: any) => {
  const res = await axiosUser.post("demo/result", payload);

  console.log(res, "submit data");
  return res;
};

export const getCurrentActive = async () => {
  const res = await axiosUser.get("quiz/current/active");

  // console.log(res);
  return res;
};
export const getDemoQuestions = async () => {
  const res = await axiosUser.get("demo/quiz");

  // console.log(res);
  return res;
};

export const submitLiveQuestion = async (data: any) => {
  const res = await axiosUser.post("question/submit", data);
  console.log(res, "submit data");
  return res;
};
export const submitAttempt = async (detailsId: string, data: any) => {
  console.log(detailsId, "details id");
  const res = await axiosUser.post(
    `question/attempt/submit/${detailsId}`,
    data,
  );
  console.log(res, "submit attempt data");
  return res;
};

//REFERRAL ENDPOINTS
export const getReferrals = async (limit: number, page: number, id: string) => {
  const res = await axiosUser.get(`referral/${id}?limit=${limit}&page=${page}`);
  return res;
};

//QUIZ ATTEMPT ENDPOINTS
export const getAttempts = async (page: number) => {
  const res = await axiosUser.get(`quiz-attempt?page=${page}`);
  return res;
};
export const getAttemptsAnswers = async (did: string, attemptId: string) => {
  const res = await axiosUser.get(`quiz-attempt/answers/${did}/${attemptId}`);
  return res;
};

/**
 * =
 * USER STATS
 * =
 */

/**
 * Complete leaderboard stats dashboard
 */
export const getUserDashboard = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}`);
};

export const getPerformanceStats = async (detailsId: string, day: any) => {
  return await axiosUser.get(`stats/user/${detailsId}/day-performance/${day}`);
};

export const getLeaderboardStats = async (param: string) => {
  return await axiosUser.get(`leaderboard/${param}`);
};

/**
 * User Rankings
 */
export const getUserRankings = async (param: string) => {
  return await axiosUser.get(`leaderboard/${param}`);
};
/**
 * Overall user stats
 */
export const getOverallUserStats = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/overall`);
};

/**
 * Last five days score history
 */
export const getLastFiveDaysScore = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/score/last-five-days`);
};

/**
 * User average score
 */
export const getLastFiveWeeksAverageScore = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/week/average`);
};

/**
 * Today's rank
 */
export const getTodayRank = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/rank/today`);
};

/**
 * =
 * profile endpoints
 * =
 */

export const getPresignedUrl = async (
  filename: string,
  fileSize: number,
  contentType: string,
) => {
  const url = await axiosUser.post("s3/upload-url", {
    fileSize,
    filename,
    contentType,
  });
  return url;
};

export const updateProfileImage = async (data: IUserDetails) => {
  const res = await axiosUser.patch(`user-details/update-avatar/`, data);
  return res;
};

export const updateProfileData = async (data: {
  name: string;
  phone: string;
}) => {
  const res = await axiosUser.patch(`user/update/`, data);
  return res;
};

/**
 * Rank for a specific day
 * Example:
 * 15-07-2026
 */
export const getRankForDay = async (detailsId: string, day: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/rank/${day}`);
};

/**
 * =
 * LEADERBOARDS
 * =
 */

/**
 * Combined leaderboard
 */
export const getOverallLeaderboard = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/overall?limit=${limit}`);
};

/**
 * Overall XP leaderboard
 */
export const getXpLeaderboard = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/xp?limit=${limit}`);
};

/**
 * Daily XP leaderboard
 */
export const getDailyLeaderboard = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/xp/daily?limit=${limit}`);
};

/**
 * Weekly XP leaderboard
 */
export const getWeeklyLeaderboard = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/xp/weekly?limit=${limit}`);
};

/**
 * Monthly XP leaderboard
 */
export const getMonthlyLeaderboard = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/xp/monthly?limit=${limit}`);
};

/**
 * Previous five weeks leaderboard history
 */
export const getWeeklyLeaderboardHistory = async (limit = 10) => {
  return await axiosUser.get(`leaderboard/xp/weekly/history?limit=${limit}`);
};

/**
 * Referral leaderboard
 */
export const getReferralLeaderboard = async () => {
  return await axiosUser.get(`leaderboard/referral`);
};

//ADMIN ENDPOINTS
export const adminLogin = async (payload: any) => {
  console.log(payload, "admin login payload");
  const res = await axiosSystem.post("auth/admin/login", payload);
  console.log(res, "admin login response");
  return res;
};

export const createQuiz = async (payload: any) => {
  console.log(payload, "create quiz payload");
  const res = await axiosAdmin.post("quiz/seed", payload);
  console.log(res, "create quiz response");
  return res;
};
export const updateQuizData = async (payload: any) => {
  console.log(payload, "update quiz payload");
  const res = await axiosAdmin.put("quiz/update", payload);
  console.log(res, "create quiz response");
  return res;
};

export const fetchQuizById = async (quizId: string) => {
  console.log(quizId, "auifdk)");
  const res = await axiosAdmin.get(`quiz/${quizId}`);
  return res;
};

export const createQuestion = async (payload: IQuestionSubmit[]) => {
  const res = await axiosAdmin.post("question/seed", payload);
  return res;
};
export const updateQuiz = async (id: string, payload: any) => {
  console.log(id, "update quiz id");
  console.log(
    {
      id,
      questions: payload,
    },
    "update quiz id",
  );
  const res = await axiosAdmin.patch(`quiz/update/seed`, {
    id,
    questions: payload,
  });
  console.log(res, "update quiz response");
  return res;
};
export const createQuizBatch = async (payload: QuizObject[]) => {
  const res = await axiosAdmin.post(`quiz/batch/seed`, payload);
  console.log(res, "update quiz response");
  return res;
};
//SUPPORT ENDPOINT
export const sendSupportMessage = async (messages: any[]) => {
  const res = await axiosUser.post(
    "support-ai",
    { messages: messages },
    { responseType: "stream", adapter: "fetch" },
  );
  return res;
};

//SYSTEM ENDPOINTS

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

export const getAllQuiz = async (query: string) => {
  const res = await axiosAdmin.get(`quiz/status?status=${query.toUpperCase()}`);
  return res;
};
export const getAllActiveQuiz = async () => {
  const res = await axiosUser.get(`quiz/active`);
  return res;
};

export const getAllUserQuizzes = async (did: string) => {
  const res = await axiosUser.get(`attempts/${did}`);
  console.log(res);
  return res;
};
export const deleteQuiz = async (id: string) => {
  console.log(id, "delete quiz id");
  const res = await axiosAdmin.delete(`quiz/delete/${id}`);
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
