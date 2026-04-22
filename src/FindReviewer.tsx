import { useState, useEffect } from "react";

import "./styles/find-reviewer.css";

interface Contributor {
  id: number;
  login: string;
  url: string;
  avatar_url: string;
}

type ErrorType = "notFound" | "rateLimit" | "noCandidates" | "validation" | "network" | "unknown";

interface ErrorInfo {
  type: ErrorType;
  message: string;
}

export const FindReviewer = () => {
  const [reviewer, setReviewer] = useState<Contributor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Contributor | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");

  const findReviewer = async () => {
    setLoading(true);
    setError(null);
    setReviewer(null);

    try {
      const login = localStorage.getItem("settings_login");
      const repo = localStorage.getItem("settings_repo");
      const blacklistRaw = localStorage.getItem("settings_blacklist");
      const blacklist: string[] = blacklistRaw ? JSON.parse(blacklistRaw) : [];

      if (!login || !repo) {
        setError({
          type: "validation",
          message: "Необходимо настроить логин и репозиторий в настройках"
        });
        setLoading(false);
        return;
      }

      const [owner, repoName] = repo.split("/");
      if (!owner || !repoName) {
        setError({
          type: "validation",
          message: "Неверный формат репозитория. Используйте формат: owner/repo"
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=100`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError({
            type: "notFound",
            message: `Репозиторий "${owner}/${repoName}" не найден. Проверьте правильность ввода.`
          });
        } else if (response.status === 403) {
          const errorData = await response.json();
          const resetTime = errorData.reset_at
            ? new Date(errorData.reset_at * 1000).toLocaleTimeString("ru-RU")
            : "через час";
          setError({
            type: "rateLimit",
            message: `Превышен лимит запросов к GitHub API. Пожалуйста, ${resetTime} попробуйте снова.`
          });
        } else if (response.status === 401) {
          setError({
            type: "unknown",
            message: "Требуется аутентификация для доступа к репозиторию."
          });
        } else {
          setError({
            type: "unknown",
            message: `Ошибка API: ${response.status} ${response.statusText}`
          });
        }
        setLoading(false);
        return;
      }

      const contributors: Contributor[] = await response.json();

      const filteredContributors = contributors.filter(
        (c) => c.login !== login && !blacklist.includes(c.login)
      );

      if (filteredContributors.length === 0) {
        setError({
          type: "noCandidates",
          message: "Не найдено подходящих кандидатов. Все контрибьюторы исключены из поиска (текущий пользователь или в черном списке)."
        });
        setLoading(false);
        return;
      }

      let candidateIndex = 0;
      const animationDuration = 2000;
      const intervalTime = 100;

      const animationInterval = setInterval(() => {
        setCurrentCandidate(
          filteredContributors[candidateIndex % filteredContributors.length]
        );
        candidateIndex++;
      }, intervalTime);

      setTimeout(() => {
        clearInterval(animationInterval);
        const randomIndex = Math.floor(Math.random() * filteredContributors.length);
        const selectedReviewer = filteredContributors[randomIndex];
        setCurrentCandidate(null);
        setReviewer(selectedReviewer);
        setLoading(false);
      }, animationDuration);
    } catch (err) {
      if (err instanceof Error) {
        setError({
          type: err.name === "TypeError" ? "network" : "unknown",
          message: err.message
        });
      } else {
        setError({
          type: "unknown",
          message: "Произошла неизвестная ошибка"
        });
      }
      setLoading(false);
      setCurrentCandidate(null);
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("settings_login");
    setCurrentUser(login || "");

    return () => {
      setCurrentCandidate(null);
    };
  }, []);

  const renderError = (errorInfo: ErrorInfo) => {
    const icons = {
      notFound: "🔍",
      rateLimit: "⏳",
      noCandidates: "👥",
      validation: "⚠️",
      network: "🌐",
      unknown: "❓"
    };

    const titles = {
      notFound: "Репозиторий не найден",
      rateLimit: "Превышен лимит запросов",
      noCandidates: "Нет подходящих кандидатов",
      validation: "Ошибка валидации",
      network: "Ошибка сети",
      unknown: "Произошла ошибка"
    };

    const hints = {
      notFound: "💡 Убедитесь, что репозиторий существует и имя указано корректно.",
      rateLimit: "💡 GitHub API позволяет до 60 запросов в час для неавторизованных пользователей.",
      noCandidates: "💡 Попробуйте расширить список репозитория или уменьшить черный список.",
      validation: "💡 Откройте настройки и заполните все необходимые поля.",
      network: "💡 Проверьте интернет-соединение и попробуйте снова.",
      unknown: ""
    };

    return (
      <div className={`find-reviewer__error find-reviewer__error--${errorInfo.type}`}>
        <div className="find-reviewer__error-content">
          <span className="find-reviewer__error-icon">{icons[errorInfo.type]}</span>
          <div className="find-reviewer__error-body">
            <p className="find-reviewer__error-title">{titles[errorInfo.type]}</p>
            <p className="find-reviewer__error-message">{errorInfo.message}</p>
            {hints[errorInfo.type] && (
              <p className="find-reviewer__error-hint">{hints[errorInfo.type]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="find-reviewer">
      {currentUser && (
        <div className="find-reviewer__current-user">
          <p className="find-reviewer__info-text">
            <strong>Текущий пользователь:</strong> {currentUser}
          </p>
        </div>
      )}

      <button
        className="find-reviewer__button"
        onClick={findReviewer}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="find-reviewer__spinner"></span>
            Поиск...
          </>
        ) : (
          "Найти ревьюера"
        )}
      </button>

      {error && renderError(error)}

      {currentCandidate && (
        <div className="find-reviewer__candidate">
          <p className="find-reviewer__candidate-text">Перебор кандидатов...</p>
          <div className="find-reviewer__candidate-info">
            <img
              src={currentCandidate.avatar_url}
              alt={currentCandidate.login}
              className="find-reviewer__candidate-avatar"
            />
            <div className="find-reviewer__candidate-details">
              <strong className="find-reviewer__candidate-name">{currentCandidate.login}</strong>
              <p className="find-reviewer__candidate-number">
                Кандидат #{Math.floor(Math.random() * 100) + 1}
              </p>
            </div>
          </div>
        </div>
      )}

      {reviewer && !loading && (
        <div className="find-reviewer__reviewer">
          <h3 className="find-reviewer__reviewer-title">✨ Выбранный ревьюер:</h3>
          <div className="find-reviewer__reviewer-content">
            <img
              src={reviewer.avatar_url}
              alt={reviewer.login}
              className="find-reviewer__reviewer-avatar"
            />
            <div className="find-reviewer__reviewer-details">
              <p className="find-reviewer__reviewer-name">{reviewer.login}</p>
              <a
                href={`https://github.com/${reviewer.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="find-reviewer__reviewer-link"
              >
                Профиль на GitHub →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
