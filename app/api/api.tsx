import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKLINK,
  withCredentials: true,
});
console.log(
  "BACKEND URL =",
  process.env.NEXT_PUBLIC_BACKLINK
);