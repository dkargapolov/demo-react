import { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "./store/hooks";
import { setLogin, setRepo, setBlacklist } from "./store/settingsSlice";

import { validateRepoFormat } from "./utils/validation";

import "./styles/settings.css";

export const Settings = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [blacklistInput, setBlacklistInput] = useState("");

  const settings = useAppSelector((state) => state.settings);

  const handleRepoChange = (value: string) => {
    dispatch(setRepo(value));

    if (value.trim()) {
      const result = validateRepoFormat(value);
      setRepoError(result.error);
    } else {
      setRepoError(null);
    }
  };

  const handleBlacklistChange = (value: string) => {
    setBlacklistInput(value);
  };

  const handleBlacklistBlur = () => {
    const logins = blacklistInput
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    dispatch(setBlacklist(logins));
    setBlacklistInput(logins.join(", "));
  };

  useEffect(() => {
    setBlacklistInput(settings.blacklist.join(", "));
  }, []);

  return (
    <div className="settings">
      <button
        className="settings__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Скрыть настройки" : "Показать настройки"}
      </button>

      {isOpen && (
        <div className="settings__content">
          <div className="settings__field">
            <label htmlFor="login" className="settings__label">
              Login:
            </label>
            <input
              id="login"
              type="text"
              className="settings__input"
              value={settings.login}
              onChange={(e) => dispatch(setLogin(e.target.value))}
              placeholder="Введите логин"
            />
          </div>

          <div className="settings__field">
            <label htmlFor="repo" className="settings__label">
              Repo:
            </label>
            <input
              id="repo"
              type="text"
              className={`settings__input ${repoError ? "settings__input--error" : ""}`}
              value={settings.repo}
              onChange={(e) => handleRepoChange(e.target.value)}
              placeholder="owner/repo"
            />
            {repoError && (
              <div className="settings__error">
                <span className="settings__error-icon">⚠️</span>
                <span>{repoError}</span>
              </div>
            )}
          </div>

          <div className="settings__field settings__field--last">
            <label htmlFor="blacklist" className="settings__label">
              Blacklist (опционально):
            </label>
            <input
              id="blacklist"
              type="text"
              className="settings__input"
              value={blacklistInput}
              onChange={(e) => handleBlacklistChange(e.target.value)}
              onBlur={handleBlacklistBlur}
              placeholder="логин1, логин2, логин3"
            />
          </div>
        </div>
      )}
    </div>
  );
};
