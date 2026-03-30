import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export default apiClient;