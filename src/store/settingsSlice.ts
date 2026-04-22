import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Settings } from "./types";

const loadSettingsFromStorage = (): Settings => {
  const login = localStorage.getItem("settings_login") || "";
  const repo = localStorage.getItem("settings_repo") || "";
  const blacklistRaw = localStorage.getItem("settings_blacklist");

  try {
    const blacklist = blacklistRaw ? JSON.parse(blacklistRaw) : [];
    return { login, repo, blacklist };
  } catch (error) {
    return { login, repo, blacklist: [] };
  }
};

const initialState: Settings = loadSettingsFromStorage();

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
      localStorage.setItem("settings_login", action.payload);
    },
    setRepo: (state, action: PayloadAction<string>) => {
      state.repo = action.payload;
      localStorage.setItem("settings_repo", action.payload);
    },
    setBlacklist: (state, action: PayloadAction<string[]>) => {
      state.blacklist = action.payload;
      localStorage.setItem("settings_blacklist", JSON.stringify(action.payload));
    },
    clearSettings: (state) => {
      state.login = "";
      state.repo = "";
      state.blacklist = [];
      localStorage.removeItem("settings_login");
      localStorage.removeItem("settings_repo");
      localStorage.removeItem("settings_blacklist");
    },
  },
});

export const { setLogin, setRepo, setBlacklist, clearSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
