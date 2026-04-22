# 🎲 Code Reviewer Finder

Приложение для случайного выбора ревьюера из репозитория GitHub. Позволяет исключить текущего пользователя и нежелательных кандидатов через черный список.

## 🚀 Технологии

- **React 19** — UI библиотека
- **TypeScript** — статическая типизация
- **Redux Toolkit (RTK)** — управление состоянием
- **React Redux** — интеграция React с Redux
- **Vite** — сборщик и dev сервер
- **CSS (BEM)** — методология именования классов

## 📁 Структура проекта

```
src/
├── components/
│   ├── App.tsx              # Главный компонент с провайдером Redux
│   ├── Settings.tsx         # Компонент настроек (login, repo, blacklist)
│   ├── FindReviewer.tsx     # Компонент поиска с localStorage
│   └── FindReviewerRandom.tsx # Компонент поиска с пропсами
├── store/
│   ├── store.ts              # Конфигурация Redux store
│   ├── settingsSlice.ts     # Слайс для настроек с localStorage
│   ├── repoSlice.ts          # Слайс для данных репозитория
│   ├── middleware.ts         # Middleware для ошибок
│   ├── types.ts              # TypeScript типы
│   ├── hooks.ts              # Типизированные хуки useDispatch/useSelector
│   └── index.ts              # Централизованный экспорт
├── styles/
│   ├── index.css             # Глобальные стили и переменные
│   ├── app.css               # Стили App компонента
│   ├── settings.css          # Стили компонента Settings
│   └── find-reviewer.css     # Стили FindReviewer компонентов
├── utils/
│   └── validation.ts         # Утилиты валидации и фильтрации
├── main.tsx                  # Точка входа приложения
└── vite-env.d.ts            # Типы Vite
```

## ✨ Функциональность

### 1. Настройки (Settings)
- Ввод логина текущего пользователя
- Ввод репозитория в формате `owner/repo` с валидацией
- Ввод черного списка через запятую
- Автоматическое сохранение в localStorage
- Показать/скрыть настройки

### 2. Поиск ревьюера (FindReviewerRandom)
- Загрузка списка контрибьюторов из GitHub API
- Фильтрация: исключение текущего пользователя и blacklist
- Анимация перебора кандидатов (2 секунды)
- Случайный выбор ревьюера из отфильтрованного списка
- Отображение выбранного ревьюера с аватаром и ссылкой на GitHub

### 3. Обработка ошибок
- `404 Not Found` — репозиторий не найден
- `403 Rate Limit` — превышен лимит запросов к API
- `No Candidates` — нет подходящих ревьюеров
- `Validation Error` — невалидные данные репозитория
- `Network Error` — проблемы с соединением

### 4. Валидация
- Проверка формата репозитория: `/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/`
- Парсинг строки `owner/repo` в объекты
- Фильтрация контрибьюторов по логину и blacklist
- Рандомный выбор из массива

## 🎨 CSS (BEM методология)

Все стилизовано с использованием классов по методологии БЭМ:
- `блок__элемент--модификатор`
- Глобальные CSS-переменные для цветов и размеров
- Анимации: `fadeIn`, `slideIn`, `pulse`, `spin`

## 🔧 Redux архитектура

### Store
```typescript
interface RootState {
  repoData: {
    contributors: Contributor[];
    error: string | null;
    loading: boolean;
  };
  settings: {
    login: string;
    repo: string;
    blacklist: string[];
  };
}
```

### Async Thunk
`fetchContributors` — загружает контрибьюторов из GitHub API с обработкой ошибок

### Middleware
`errorHandlingMiddleware` — логирует ошибки API и обрабатывает rate limiting

## 🚀 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Линтинг
npm run lint
```

## 📝 Пример использования

1. Откройте настройки и введите:
   - Login: ваш GitHub логин
   - Repo: `owner/repo` (например: `facebook/react`)
   - Blacklist (опционально): `user1, user2, user3`

2. Нажмите "Найти ревьюера"

3. Наблюдайте анимацию перебора кандидатов

4. Получите случайного ревьюера из отфильтрованного списка
