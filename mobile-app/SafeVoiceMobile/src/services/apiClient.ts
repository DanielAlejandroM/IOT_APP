import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://172.20.10.9:8000/",

});

apiClient.interceptors.request.use(async (config) => {

  const token = await AsyncStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
