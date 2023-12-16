// import CustomEnvironment from "@/config/customJest.js";

export default {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
};
