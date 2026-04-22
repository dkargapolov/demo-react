import { Contributor } from "../store/types";

const REPO_REGEX = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

export const validateRepoFormat = (
  repo: string
): { valid: boolean; error: string | null } => {
  if (!repo.trim()) {
    return { valid: false, error: "Поле репозитория обязательно для заполнения" };
  }

  const trimmedRepo = repo.trim();

  if (!REPO_REGEX.test(trimmedRepo)) {
    return {
      valid: false,
      error: "Неверный формат. Используйте формат: owner/repo"
    };
  }

  const [owner, repoName] = trimmedRepo.split("/");

  if (!owner || !repoName) {
    return {
      valid: false,
      error: "Неверный формат. Используйте формат: owner/repo"
    };
  }

  return { valid: true, error: null };
};

export const parseRepo = (repo: string): { owner: string; repo: string } | null => {
  const validation = validateRepoFormat(repo);

  if (!validation.valid) {
    return null;
  }

  const [owner, repoName] = repo.trim().split("/");
  return { owner, repo: repoName };
};

export const filterContributors = (
  contributors: Contributor[],
  login: string,
  blacklist: string[]
): Contributor[] => {
  return contributors.filter(
    (contributor) =>
      contributor.login !== login && !blacklist.includes(contributor.login)
  );
};

export const getRandomContributor = (
  contributors: Contributor[]
): Contributor | null => {
  if (contributors.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * contributors.length);
  return contributors[randomIndex];
};

export const isContributorEligible = (
  contributor: Contributor,
  login: string,
  blacklist: string[]
): boolean => {
  return contributor.login !== login && !blacklist.includes(contributor.login);
};
