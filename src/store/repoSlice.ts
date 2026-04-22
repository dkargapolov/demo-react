import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type {
  Contributor,
  RepoData,
  FetchContributorsParams,
  ApiResponseError
} from "./types";

interface FetchContributorsResponse {
  contributors: Contributor[];
  error?: string;
}

export const fetchContributors = createAsyncThunk<
  FetchContributorsResponse,
  Pick<FetchContributorsParams, "owner" | "repo">,
  { rejectValue: string }
>(
  "repoData/fetchContributors",
  async ({ owner, repo }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`
      );

      if (!response.ok) {
        const errorData: ApiResponseError = await response.json();

        if (response.status === 403) {
          return rejectWithValue("Превышен лимит запросов к GitHub API. Попробуйте позже.");
        }
        if (response.status === 404) {
          return rejectWithValue("Репозиторий не найден. Проверьте правильность owner/repo.");
        }
        if (response.status === 401) {
          return rejectWithValue("Требуется аутентификация.");
        }

        return rejectWithValue(
          errorData.message || `Ошибка API: ${response.status}`
        );
      }

      const contributors: Contributor[] = await response.json();

      return { contributors };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при запросе к API");
    }
  }
);

export const getFilteredContributors = (
  contributors: Contributor[],
  login?: string,
  blacklist?: string[]
): Contributor[] => {
  return contributors.filter(
    (contributor) =>
      contributor.login !== login &&
      !blacklist?.includes(contributor.login)
  );
};

const initialState: RepoData = {
  contributors: [],
  error: null,
  loading: false,
};

export const repoSlice = createSlice({
  name: "repoData",
  initialState,
  reducers: {
    setContributors: (state, action: PayloadAction<Contributor[]>) => {
      state.contributors = action.payload;
    },
    clearContributors: (state) => {
      state.contributors = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContributors.fulfilled,
        (state, action: PayloadAction<FetchContributorsResponse>) => {
          state.loading = false;
          state.contributors = action.payload.contributors;
        }
      )
      .addCase(fetchContributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Не удалось загрузить контрибьюторов";
      });
  },
});

export const { setContributors, clearContributors, clearError, setError } = repoSlice.actions;

export default repoSlice.reducer;
