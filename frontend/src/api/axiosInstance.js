import axios from "axios";

const api = axios.create({
  baseURL: "https://annot.onrender.com/api",
});

export default api;
