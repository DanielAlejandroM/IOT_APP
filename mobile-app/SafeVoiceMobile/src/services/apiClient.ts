import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.3.178:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export default apiClient;