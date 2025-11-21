import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { data } = error.response;
      if (data?.error?.message) {
        toast(data.error.message, {
          type: "error",
        });
      }
    }

    return Promise.reject(error);
  },
);
