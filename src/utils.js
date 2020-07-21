import axios from "axios";
import { endpoint } from "./constants";

// export const authAxios = () => {
//   const auth = axios.create({
//     baseURL: endpoint,
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//     },
//     timeout: 10000,
//   });
//   return auth;
// };

export const authAxios = () => {
  const auth = axios.create({
    baseURL: endpoint,
    withCredentials: true,
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    // },
    timeout: 10000,
  });
  return auth;
};
