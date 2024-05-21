import { BASE_URL } from "./config.js";
import axios from "axios";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 3 * 1000,
  withCredentials: true,
});

export const request = (config) => {
  const client = instance;
  return client(config);
};

const fetcher = async (config) => {
  const { data } = await request({ ...config });

  return data;
};

export default fetcher;
