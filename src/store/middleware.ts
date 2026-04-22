import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";

export const errorHandlingMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === "object" && action !== null && "type" in action) {
    const typedAction = action as { type: string; payload?: unknown };
    if (typedAction.type.startsWith("repoData/") && typedAction.type.endsWith("/rejected")) {
      const error = typedAction.payload || "Неизвестная ошибка";

      console.error("API Error:", error);

      if (typeof error === "string" && error.includes("limite")) {
        console.warn("GitHub API Rate limiting triggered");
      }
    }
  }

  return next(action);
};

export const loggingMiddleware: Middleware = (store: MiddlewareAPI) => (next) => (action) => {
  console.log("Dispatching action:", typeof action === "object" && action !== null && "type" in action ? (action as { type: string }).type : action);
  const result = next(action);
  console.log("New state:", store.getState());
  return result;
};
