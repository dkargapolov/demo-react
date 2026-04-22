export interface Contributor {
  id: number;
  login: string;
  url: string;
  avatar_url: string;
  contributions: number;
}

export interface RepoData {
  contributors: Contributor[];
  error: string | null;
  loading: boolean;
}

export interface Settings {
  login: string;
  repo: string;
  blacklist: string[];
}

export interface RootState {
  repoData: RepoData;
  settings: Settings;
}

export interface FetchContributorsParams {
  owner: string;
  repo: string;
  login?: string;
  blacklist?: string[];
}

export interface ApiResponseError {
  message: string;
  status?: number;
  documentation_url?: string;
}
