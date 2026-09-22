import axios from "axios";
// const live = true;
const axiosUser = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});
const axiosAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});

const axiosSystem = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL:"https://genuslab.online"
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});
export { axiosUser, axiosSystem, axiosAdmin };
