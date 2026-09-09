import axios from "axios";
// const live = true;
const axiosUser = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});
const axiosAdmin = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});

const axiosSystem = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  // baseURL:"https://genuslab.online"
  // baseURL: "https://genuslab-quiz-backend.onrender.com/api/v1",
  withCredentials: true,
});
export { axiosUser, axiosSystem, axiosAdmin };
