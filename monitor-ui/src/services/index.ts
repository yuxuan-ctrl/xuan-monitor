import axios from "axios";

const serviceInstance = axios.create({
  baseURL: "/api",
  timeout: 6000,
  headers: {
    Accept: "*/*",
  },
});

export default serviceInstance;
