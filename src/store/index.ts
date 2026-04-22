export { store } from "./store";
export type { AppDispatch, RootState } from "./store";

export { default as repoReducer } from "./repoSlice";
export {
  fetchContributors,
  getFilteredContributors,
  setContributors,
  clearContributors,
  clearError,
  setError,
} from "./repoSlice";

export { default as settingsReducer } from "./settingsSlice";
export {
  setLogin,
  setRepo,
  setBlacklist,
  clearSettings,
} from "./settingsSlice";

export {
  errorHandlingMiddleware,
  loggingMiddleware,
} from "./middleware";

export { useAppDispatch, useAppSelector } from "./hooks";

export type {
  Contributor,
  RepoData,
  Settings,
  FetchContributorsParams,
  ApiResponseError,
} from "./types";
