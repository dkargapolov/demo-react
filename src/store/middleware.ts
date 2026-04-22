import type { Middleware } from "@reduxjs/toolkit";

export const errorHandlingMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type.startsWith("repoData/") && action.type.endsWith("/rejected")) {
    const error = action.payload || "Неизвестная ошибка";

    console.error("API Error:", error);

    if (typeof error === "string" && error.includes("limite")) {
      console.warn("GitHub API Rate limiting triggered");
    }
  }

  return next(action);
};

export const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  console.log("Dispatching action:", action.type);
  const result = next(action);
  console.log("New state:", store.getState());
  return result;
};
