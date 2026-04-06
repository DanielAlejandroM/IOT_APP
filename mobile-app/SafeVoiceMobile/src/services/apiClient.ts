import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.12:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});


export default apiClient;