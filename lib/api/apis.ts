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
  const res = await axiosSystem.post("auth/register", payload);
  return res;
};

export const getNotifications = async (query?: "read" | "unread") => {
  const res = await axiosUser.get(
    `notification?${query ? `type=${query}` : ""}`,
  );
  return res;
};

// Admin version: uses axiosAdmin so an expired token sends you to the
// admin login, not /login.
export const getAdminNotifications = async (query?: "read" | "unread") => {
  const res = await axiosAdmin.get(
    `notification?${query ? `type=${query}` : ""}`,
  );
  return res;
};

export const markNotificationAsRead = async (id: string) => {
  const res = await axiosUser.patch(`notification/mark-as-read/${id}`);
  return res;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axiosUser.patch(`notification/mark-all-as-read`);
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
  const res = await axiosSystem.post("auth/login", payload);

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

// Admin logout: clears adminRefreshToken and redirects to the admin login
// if the session has already expired.
export const adminLogout = async () => {
  const res = await axiosAdmin.delete("auth/admin/logout");
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
  const res = await axiosUser.get(`user/profile/${id}`);
  return res;
};

// Admin version of getUserProfile (axiosAdmin).
export const getAdminOwnProfile = async (id: string) => {
  const res = await axiosAdmin.get(`user/profile/${id}`);
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

  return res;
};
export const getScoreTotal = async (email: string) => {
  // console.log(payload, "login user payload");
  const res = await axiosUser.post("scorehistory/gl_api/v2/total", {
    email,
  });

  return res;
};
export const getQuizNumber = async (email: string) => {
  // console.log(payload, "login user payload");
  const res = await axiosUser.post("scorehistory/gl_api/v2/histo_num", {
    email,
  });

  return res;
};

export const getRankData = async () => {
  const res = await axiosUser.get("rank/all");

  return res;
};

export const getRankById = async (rankId: string) => {
  const res = await axiosUser.get(`rank/${rankId}`);

  return res;
};

export const getRankLeaderboard = async (rankId: string, limit = 20) => {
  const res = await axiosUser.get(
    `leaderboard/xp/rank/${rankId}?limit=${limit}`,
  );

  return res;
};

export const getRankUserPosition = async (
  rankId: string,
  userDetailsId: string,
) => {
  const res = await axiosUser.get(
    `leaderboard/xp/rank/${rankId}/${userDetailsId}`,
  );

  return res;
};

export const getQuizSession = async (id: string, userDetailsId: string) => {
  const res = await axiosUser.get(`quiz/session/${id}?did=${userDetailsId}`);

  return res;
};

export const getDemoResult = async (payload: any) => {
  const res = await axiosUser.post("demo/result", payload);

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

  return res;
};
export const submitAttempt = async (detailsId: string, data: any) => {
  const res = await axiosUser.post(
    `question/attempt/submit/${detailsId}`,
    data,
  );

  return res;
};

// TRANSACTION ENDPOINTS

// Admin only.
export const createTransaction = async (payload: {
  userId: string;
  type: string;
  title: string;
  description?: string;
  amount: number;
  status?: string;
}) => {
  const res = await axiosAdmin.post("transaction", payload);
  return res;
};

/**
 * Get all system transactions (Admin only) subsc
 */
export const getAllTransactions = async (params?: {
  type?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    type,
    status,
    search,
    startDate,
    endDate,
    limit = 10,
    page = 1,
  } = params || {};

  const queryParams = new URLSearchParams();
  if (type) queryParams.append("type", type);
  if (status) queryParams.append("status", status);
  if (search) queryParams.append("search", search);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());

  const res = await axiosAdmin.get(`transaction/all?${queryParams.toString()}`);
  return res;
};

export const getAdminTransactionSummary = async () => {
  const res = await axiosAdmin.get("transaction/admin/summary");
  return res;
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionById = async (id: string) => {
  const res = await axiosUser.get(`transaction/${id}`);
  return res;
};

export const getAdminTransactionById = async (id: string) => {
  const res = await axiosAdmin.get(`transaction/${id}`);
  return res;
};

export const updateTransactionStatus = async (id: string, status: string) => {
  const res = await axiosAdmin.patch(`transaction/${id}/status`, { status });
  return res;
};

// Current user's transactions, filtered and paginated.
export const getUserTransactions = async (params?: {
  type?: string;
  status?: string;
  limit?: number;
  page?: number;
}) => {
  const { type, status, limit = 10, page = 1 } = params || {};

  const queryParams = new URLSearchParams();
  if (type) queryParams.append("type", type);
  if (status) queryParams.append("status", status);
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());

  const res = await axiosUser.get(`transaction/user?${queryParams.toString()}`);
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

// Another user's public stats (leaderboard profile).
export const getPublicUserStats = async (detailsId: string) => {
  return await axiosUser.get(`stats/user/${detailsId}/public`);
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

// Rank for a day, e.g. "15-07-2026".
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
/**
 * Episode leaderboard
 */
export const getEpisodeLeaderboard = async (
  dateStr: string,
  episode: string,
) => {
  return await axiosUser.get(
    `leaderboard/episode?dateStr=${dateStr}&episode=${episode}`,
  );
};
/**
 * Episode leaderboard
 */

export const getLastFiveRewards = async (detailsId: string) => {
  return await axiosUser.get(`reward/last-five/${detailsId}`);
};
export const getTotalRewards = async (detailsId: string) => {
  return await axiosUser.get(`reward/total/${detailsId}`);
};

/**
 * Get total rewards for today
 */
export const getTodayTotalRewards = async () => {
  return await axiosUser.get(`reward/today/total`);
};

/**
 * Get most recent reward
 */
export const getMostRecentReward = async () => {
  return await axiosUser.get(`reward/most-recent`);
};

/**
 * Get most recent transaction
 */
export const getMostRecentTransaction = async () => {
  return await axiosUser.get(`transaction/most-recent`);
};

/**
 * Episode leaderboard
 */

export const getUserSubscription = async () => {
  const res = await axiosUser.get(`subscription/active`);
  return res;
};

export const getUserSubscriptions = async () => {
  const res = await axiosUser.get(`subscription/mine`);
  return res;
};

export const getUserSubscriptionById = async (id: string) => {
  const res = await axiosUser.get(`subscription/${id}`);
  return res;
};

export const subscribe = async (data: {
  name: string;
  price: number;
  txRef: string;
}) => {
  const res = await axiosUser.post("subscription", data);
  return res;
};

// Sends the tx_ref this checkout will use, so the server can recover the
// payment if we never get to report it.
export const acquireCheckoutLock = async (txRef: string) => {
  const res = await axiosUser.post(`subscription/checkout-lock`, { txRef });
  return res;
};
export const releaseCheckoutLock = async () => {
  const res = await axiosUser.post(`subscription/checkout-lock/release`);
  return res;
};
//ADMIN ENDPOINTS
export const adminLogin = async (payload: any) => {
  const res = await axiosSystem.post("auth/admin/login", payload);
  return res;
};

export const createQuiz = async (payload: any) => {
  const res = await axiosAdmin.post("quiz/seed", payload);
  return res;
};
export const updateQuizData = async (payload: any) => {
  const res = await axiosAdmin.put("quiz/update", payload);
  return res;
};

export const fetchQuizById = async (quizId: string) => {
  const res = await axiosAdmin.get(`quiz/${quizId}`);
  return res;
};

export const createQuestion = async (payload: IQuestionSubmit[]) => {
  const res = await axiosAdmin.post("question/seed", payload);
  return res;
};
export const updateQuiz = async (id: string, payload: any) => {
  const res = await axiosAdmin.patch(`quiz/update/seed`, {
    id,
    questions: payload,
  });
  return res;
};
export const createQuizBatch = async (payload: QuizObject[]) => {
  const res = await axiosAdmin.post(`quiz/batch/seed`, payload);
  return res;
};
//SUPPORT ENDPOINT
// Sends one message. The server keeps the conversation. The reply streams
// back as text; header x-support-mode is "ai" or "human" (staff queue).
export const sendSupportMessage = async (content: string) => {
  const res = await axiosUser.post(
    "support-ai",
    { content },
    { responseType: "stream", adapter: "fetch" },
  );
  return res;
};

export const getSupportConversation = async () => {
  const res = await axiosUser.get("support-ai/conversation");
  return res;
};

export const requestSupportHuman = async (reason?: string) => {
  const res = await axiosUser.post("support-ai/handoff", { reason });
  return res;
};

export const closeSupportConversation = async () => {
  const res = await axiosUser.post("support-ai/close");
  return res;
};

// Staff inbox (admin console)
export const getSupportChats = async (status?: string, page = 1) => {
  const res = await axiosAdmin.get("support-ai/admin/conversations", {
    params: { status: status || undefined, page },
  });
  return res;
};

export const getSupportChatSummary = async () => {
  const res = await axiosAdmin.get("support-ai/admin/summary");
  return res;
};

export const getSupportChat = async (id: string) => {
  const res = await axiosAdmin.get(`support-ai/admin/conversations/${id}`);
  return res;
};

export const replySupportChat = async (id: string, content: string) => {
  const res = await axiosAdmin.post(
    `support-ai/admin/conversations/${id}/reply`,
    { content },
  );
  return res;
};

export const setSupportChatStatus = async (id: string, status: "AI" | "CLOSED") => {
  const res = await axiosAdmin.patch(
    `support-ai/admin/conversations/${id}/status`,
    { status },
  );
  return res;
};

export const getEpisodeDetails = async () => {
  const res = await axiosSystem.get(`system/episode-slots`);
  return res;
};

// Admin-only route.
export const fetchQuizDetails = async (id: string) => {
  const res = await axiosAdmin.get(`quiz/${id}`);
  return res;
};

export const getAllQuiz = async (
  query: string,
  page: number = 1,
  limit: number = 10,
) => {
  const res = await axiosAdmin.get(
    `quiz/status?status=${query.toUpperCase()}&page=${page}&limit=${limit}`,
  );
  return res;
};
export const getAllActiveQuiz = async () => {
  const res = await axiosUser.get(`quiz/active`);
  return res;
};

export const getAllUserQuizzes = async (did: string) => {
  const res = await axiosUser.get(`attempts/${did}`);
  return res;
};
export const deleteQuiz = async (id: string) => {
  const res = await axiosAdmin.delete(`quiz/delete/${id}`);
  return res;
};

// Admin-only: the response includes the answer.
export const fetchQuestionDetails = async (id: string) => {
  const res = await axiosAdmin.get(`question/${id}`);
  return res;
};

export const fetchQuizQuestions = async (id: string) => {
  const res = await axiosAdmin.get(`quiz/questions/${id}`);
  return res;
};

// BANK ENDPOINTS
export const linkBankAccount = async (payload: any) => {
  const res = await axiosUser.post("accounts", payload);
  return res;
};

export const deleteBankAccount = async (id: string) => {
  const res = await axiosUser.delete(`accounts/${id}`);
  return res;
};

// SYSTEM ENDPOINTS
// Day counter lives on the quiz controller.
export const getQuizDay = async () => {
  const res = await axiosAdmin.get("quiz/activity-details");
  return res;
};

export const getSlotDetails = async () => {
  const res = await axiosSystem.get(`system/quiz-slots`);
  return res;
};
export const getTime = async () => {
  const res = await axiosSystem.get("system/time");
  return res;
};

export const getApprovedBanks = async () => {
  const res = await axiosSystem.get("bank");
  // console.log(res, "approved banks response");
  return res.data;
};

export const getNextTime = async () => {
  const res = await axiosSystem.get("system/next-quiz");
  return res;
};
//general endpoints

const getRankings = async () => {
  const res = await axiosUser.get("rank/all");
  return res;
};

//ADMIN PANEL ENDPOINTS (dashboard stats, user management, settings)
export const getAdminStats = async () => {
  const res = await axiosAdmin.get("admin/stats");
  return res;
};

export const getAdminUserGrowth = async (
  period: "day" | "week" | "month" = "day",
) => {
  const res = await axiosAdmin.get(`admin/stats/growth?period=${period}`);
  return res;
};

export const getAdminQuizOverview = async () => {
  const res = await axiosAdmin.get("admin/stats/quizzes");
  return res;
};

export const getAdminFinanceOverview = async () => {
  const res = await axiosAdmin.get("admin/stats/finance");
  return res;
};

export interface RankInput {
  rank: number;
  rankName: string;
  unlockXp: number;
  multiplier: number;
  reward: number;
  topics?: string[];
}

export const getAdminRanks = async () => {
  const res = await axiosAdmin.get("rank/admin/all");
  return res;
};

export const createAdminRank = async (payload: RankInput) => {
  const res = await axiosAdmin.post("rank/admin", payload);
  return res;
};

export const updateAdminRank = async (
  id: string,
  payload: Partial<RankInput>,
) => {
  const res = await axiosAdmin.patch(`rank/admin/${id}`, payload);
  return res;
};

export const deleteAdminRank = async (id: string) => {
  const res = await axiosAdmin.delete(`rank/admin/${id}`);
  return res;
};

export const getAdminRewardSummary = async () => {
  const res = await axiosAdmin.get("admin/rewards/summary");
  return res;
};

export const getAdminRewards = async (params?: {
  search?: string;
  status?: "claimed" | "unclaimed";
  source?: "QUIZ" | "REFERRAL" | "RANK_UNLOCK";
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("admin/rewards", { params });
  return res;
};

// ADMIN/ACCOUNTANT: all users' payout bank accounts (Finance > Bank Accounts).
export const getAdminBankAccounts = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("accounts/admin/bank-accounts", { params });
  return res;
};

export const sendRewardBankAccountReminder = async (id: string) => {
  const res = await axiosAdmin.post(`admin/rewards/${id}/remind-bank-account`);
  return res;
};

export const updateAdminReward = async (
  id: string,
  payload: { claimed: boolean; notes: string },
) => {
  const res = await axiosAdmin.patch(`admin/rewards/${id}`, payload);
  return res;
};

export const getAdminAuditLogs = async (params?: {
  entity?: string;
  entityId?: string;
  actorId?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("admin/audit-logs", { params });
  return res;
};

export const getAdminSubscriptions = async (params: {
  plan?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("subscription/admin/all", { params });
  return res;
};

export const getAdminSubscriptionSummary = async () => {
  const res = await axiosAdmin.get("subscription/admin/summary");
  return res;
};

export const getSubscriptionById = async (id: string) => {
  const res = await axiosAdmin.get(`subscription/${id}`);
  return res;
};

export const updateSubscriptionStatus = async (id: string, status: string) => {
  const res = await axiosAdmin.patch(`subscription/${id}`, { status });
  return res;
};

export const getAdminReferrals = async (params: {
  verified?: boolean;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("referral/admin/all", { params });
  return res;
};

export const getAdminReferralSummary = async () => {
  const res = await axiosAdmin.get("referral/admin/summary");
  return res;
};

export const getAdminReferralById = async (id: string) => {
  const res = await axiosAdmin.get(`referral/admin/${id}`);
  return res;
};

export const getAdminContacts = async (params: {
  type?: string;
  read?: boolean;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("contact/admin/all", { params });
  return res;
};

export const getAdminContactSummary = async () => {
  const res = await axiosAdmin.get("contact/admin/summary");
  return res;
};

export const getAdminContactById = async (id: string) => {
  const res = await axiosAdmin.get(`contact/${id}`);
  return res;
};

export const markContactAsRead = async (id: string) => {
  const res = await axiosAdmin.patch(`contact/${id}/read`);
  return res;
};

export interface ContactMessageInput {
  name: string;
  email: string;
  // The API takes `company`; it's saved (and read back) as `Company`.
  company?: string;
  subject: string;
  message: string;
  type?: "message" | "consultation";
}

// Public, unauthenticated submission from the /contact page. Lands in the same
// inbox the admin panel reads via `contact/admin/all`.
export const submitContactMessage = async (payload: ContactMessageInput) => {
  const res = await axiosSystem.post("contact", payload);
  return res;
};

export interface BroadcastNotificationInput {
  title: string;
  content: string;
  actionUrl?: string;
  audience: "all" | "premium" | "free" | "specific";
  userIds?: string[];
}

export const broadcastNotification = async (
  payload: BroadcastNotificationInput,
) => {
  const res = await axiosAdmin.post("notification/admin/broadcast", payload);
  return res;
};

export const getAdminNotificationHistory = async (params: {
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("notification/admin/all", { params });
  return res;
};

export const getAdminNotificationSummary = async () => {
  const res = await axiosAdmin.get("notification/admin/summary");
  return res;
};

export const getAdminNotificationDetail = async (id: string) => {
  const res = await axiosAdmin.get(`notification/admin/${id}`);
  return res;
};

export const getAdminSessions = async (params: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("session/admin/all", { params });
  return res;
};

export const getAdminSessionSummary = async () => {
  const res = await axiosAdmin.get("session/admin/summary");
  return res;
};

export const getAdminSessionById = async (id: string) => {
  const res = await axiosAdmin.get(`session/admin/${id}`);
  return res;
};

export const getAdminUserSessions = async (userId: string) => {
  const res = await axiosAdmin.get(`session/admin/user/${userId}`);
  return res;
};

export const revokeAdminSession = async (id: string) => {
  const res = await axiosAdmin.patch(`session/admin/${id}/revoke`);
  return res;
};

export const getStudioQuizzes = async (params: {
  status?: string;
  month?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("studio-quiz", { params });
  return res;
};

export const getStudioQuizById = async (id: string) => {
  const res = await axiosAdmin.get(`studio-quiz/${id}`);
  return res;
};

export interface CreateStudioQuizInput {
  title: string;
  description?: string;
  month: string;
  scheduledAt?: string;
  mediaUrl?: string;
  attachmentUrl?: string;
  autoAssignWinners?: boolean;
  winnersPerWeek?: number;
}

export const createStudioQuiz = async (payload: CreateStudioQuizInput) => {
  const res = await axiosAdmin.post("studio-quiz", payload);
  return res;
};

export const updateStudioQuizStatus = async (id: string, status: string) => {
  const res = await axiosAdmin.patch(`studio-quiz/${id}/status`, { status });
  return res;
};

export const deleteStudioQuiz = async (id: string) => {
  const res = await axiosAdmin.delete(`studio-quiz/${id}`);
  return res;
};

export const getStudioQuizWinnersForMonth = async (
  month: string,
  winnersPerWeek?: number,
) => {
  const res = await axiosAdmin.get(`studio-quiz/winners/month/${month}`, {
    params: { winnersPerWeek },
  });
  return res;
};

// Last month's top online-quiz scorer (admin route; the mobile app uses
// the client-key one).
export const getPreviousMonthEligibleCandidate = async () => {
  const res = await axiosAdmin.get(
    "studio-quiz/admin/eligible-candidate/previous-month",
  );
  return res;
};

// Top online-quiz scorer for a given month (MM-yyyy). Admin route.
export const getEligibleCandidateForMonth = async (month: string) => {
  const res = await axiosAdmin.get(
    `studio-quiz/admin/eligible-candidate/month/${month}`,
  );
  return res;
};

/** Admin-console route (Admin JWT) — the mobile app uses the separate
 * client-key-guarded `studio-quiz/participants/month/:month` route
 * instead. */
export const getStudioQuizParticipantsForMonth = async (
  month: string,
  winnersPerWeek?: number,
) => {
  const res = await axiosAdmin.get(
    `studio-quiz/admin/participants/month/${month}`,
    { params: { winnersPerWeek } },
  );
  return res;
};

export const addStudioQuizParticipant = async (
  id: string,
  payload: {
    userDetailsId: string;
    week: string;
    position?: number;
    score?: number;
  },
) => {
  const res = await axiosAdmin.post(`studio-quiz/${id}/participants`, payload);
  return res;
};

export const removeStudioQuizParticipant = async (
  id: string,
  participantId: string,
) => {
  const res = await axiosAdmin.delete(
    `studio-quiz/${id}/participants/${participantId}`,
  );
  return res;
};

export const uploadStudioQuizResults = async (
  id: string,
  payload: {
    results: {
      userDetailsId: string;
      score: number;
      position?: number;
      prize?: number;
      evidenceUrl?: string;
    }[];
    markCompleted?: boolean;
  },
) => {
  const res = await axiosAdmin.post(`studio-quiz/${id}/results`, payload);
  return res;
};

/** Invite an eligible candidate to a specific, already-created studio
 * quiz — sends them an email + in-app notification to accept. */
export const inviteStudioQuizCandidate = async (
  id: string,
  userDetailsId: string,
) => {
  const res = await axiosAdmin.post(`studio-quiz/${id}/invite`, {
    userDetailsId,
  });
  return res;
};

/** Public — powers the accept/decline page reached from the invite email. */
export const getStudioQuizInviteByToken = async (token: string) => {
  const res = await axiosSystem.get(`studio-quiz/invite/${token}`);
  return res;
};

export const acceptStudioQuizInvite = async (token: string) => {
  const res = await axiosSystem.post(`studio-quiz/invite/${token}/accept`);
  return res;
};

export const declineStudioQuizInvite = async (token: string) => {
  const res = await axiosSystem.post(`studio-quiz/invite/${token}/decline`);
  return res;
};

export interface StudioQuizQuestionInput {
  question: string;
  options: string[];
  answer: string;
}

export const getStudioQuizQuestions = async (id: string) => {
  const res = await axiosAdmin.get(`studio-quiz/${id}/questions`);
  return res;
};

/** Uploads (replaces) the full 10-question set for a studio quiz. */
export const uploadStudioQuizQuestions = async (
  id: string,
  questions: StudioQuizQuestionInput[],
) => {
  const res = await axiosAdmin.post(`studio-quiz/${id}/questions`, {
    questions,
  });
  return res;
};

export const getAdminUsers = async (params?: {
  search?: string;
  status?: string;
  plan?: "premium" | "free";
  page?: number;
  limit?: number;
}) => {
  const { search, status, plan, limit = 10, page = 1 } = params || {};

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (plan) queryParams.append("plan", plan);
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());

  const res = await axiosAdmin.get(`admin/users?${queryParams.toString()}`);
  return res;
};

export const getAdminUserById = async (id: string) => {
  const res = await axiosAdmin.get(`admin/users/${id}`);
  return res;
};

export const getAdminUserSummary = async () => {
  const res = await axiosAdmin.get("admin/users/summary");
  return res;
};

export const updateAdminUserStatus = async (id: string, status: string) => {
  const res = await axiosAdmin.patch(`admin/users/${id}/status`, { status });
  return res;
};

export const getAdminSubAdmins = async () => {
  const res = await axiosAdmin.get("admin/subadmins");
  return res;
};

export const createAdminSubAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ACCOUNTANT" | "SUPPORT";
  requirePasswordChange?: boolean;
}) => {
  const res = await axiosAdmin.post("admin/subadmins", data);
  return res;
};

export const deleteAdminSubAdmin = async (id: string) => {
  const res = await axiosAdmin.delete(`admin/subadmins/${id}`);
  return res;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await axiosAdmin.patch("auth/change-password", data);
  return res;
};

// ============ ACADEMY / COURSES ============

export const getMyCourses = async () => {
  const res = await axiosUser.get("academy/courses");
  return res;
};

export const startCourse = async (courseId: string) => {
  const res = await axiosUser.post(`academy/courses/${courseId}/start`);
  return res;
};

export const getAdminCourses = async () => {
  const res = await axiosAdmin.get("academy/admin/courses");
  return res;
};

export const createAdminCourse = async (payload: {
  rankId: string;
  title: string;
  description?: string;
  order?: number;
}) => {
  const res = await axiosAdmin.post("academy/admin/courses", payload);
  return res;
};

export const updateAdminCourse = async (
  id: string,
  payload: {
    rankId?: string;
    title?: string;
    description?: string;
    order?: number;
  },
) => {
  const res = await axiosAdmin.patch(`academy/admin/courses/${id}`, payload);
  return res;
};

export const deleteAdminCourse = async (id: string) => {
  const res = await axiosAdmin.delete(`academy/admin/courses/${id}`);
  return res;
};

export const getAdminApprovedBanks = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosAdmin.get("admin/settings/banks", { params });
  return res;
};

export const createAdminApprovedBank = async (payload: {
  bankName: string;
  bankCode: string;
}) => {
  const res = await axiosAdmin.post("admin/settings/banks", payload);
  return res;
};

export const deleteAdminApprovedBank = async (id: string) => {
  const res = await axiosAdmin.delete(`admin/settings/banks/${id}`);
  return res;
};
