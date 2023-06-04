import axios from "axios";

const serviceInstance = axios.create({
  baseURL: "/api",
  timeout: 6000,
});

export default serviceInstance;
