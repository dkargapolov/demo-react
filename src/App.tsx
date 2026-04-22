import { useAppSelector } from "./store/hooks";

import { Settings } from "./Settings";
import { FindReviewerRandom } from "./FindReviewerRandom";

import "./styles/app.css";

function App() {
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🎲 Code Reviewer Finder</h1>
        <p className="app__subtitle">Случайный выбор ревьюера из репозитория GitHub</p>
      </header>

      <Settings />

      {settings.login && settings.repo && (
        <FindReviewerRandom
          login={settings.login}
          repo={settings.repo}
          blacklist={settings.blacklist}
        />
      )}

      {!settings.login || !settings.repo ? (
        <div className="app__info">
          <p className="app__info-text">📝 Сначала настройте логин и репозиторий, чтобы начать поиск</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
