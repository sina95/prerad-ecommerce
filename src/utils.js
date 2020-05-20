import axios from "axios";
import { endpoint } from "./constants";

export const authAxios = () => {
  const auth = axios.create({
    baseURL: endpoint,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    timeout: 10000,
  });
  return auth;
};
