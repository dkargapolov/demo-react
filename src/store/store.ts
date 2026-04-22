import { configureStore } from "@reduxjs/toolkit";

import repoReducer from "./repoSlice";
import settingsReducer from "./settingsSlice";
import { errorHandlingMiddleware, loggingMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    repoData: repoReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorHandlingMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
