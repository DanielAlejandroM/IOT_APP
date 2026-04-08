import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.3.178:8000/",

});

apiClient.interceptors.request.use(async (config) => {

  const token = await AsyncStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
