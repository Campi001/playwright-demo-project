# Playwright Demo Project

Монорепозиторий под pnpm workspaces для демо-стенда с формой логина и автоматизацией тестирования.

## Структура
- `apps/backend` — Node.js + Express API (`/api/health`, `/api/auth/login`, `/api/auth/me`) с Zod-валидацией, bcrypt-храним паролем и JWT утилитой.
- `apps/frontend` — React + Vite + TS, страница login, `useAuth`, вызовы `/api/auth/login`.
- `tests/e2e` — Playwright UI-кейс успешного и ошибочного логина, со скриншотами и трейсами.

## Скрипты верхнего уровня
- `pnpm dev:backend` / `pnpm dev:frontend`
- `pnpm test:lint`
- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm ci` — последовательно гоняет все проверки.

На данный момент реализованы `apps/backend` и первичная версия `apps/frontend` с формой логина; `tests/e2e` появится позже.

## Backend
- `pnpm --filter ./apps/backend dev` — запуск Express-сервера (порт берётся из `env.PORT`).
- `pnpm --filter ./apps/backend test:unit` — Vitest юнит-тесты (`AuthService`).
- `pnpm --filter ./apps/backend test:integration` — Supertest интеграционные сценарии `/api/health`, `/api/auth/login`, `/api/auth/me`.  
  > Для прогона нужен доступ к loopback-порту; в sandbox-средах без разрешений тесты падают с `listen EPERM`.
- Эндпоинты работают с единственным хардкодным пользователем `demo/demo123`; пароль хранится в виде bcrypt-хеша.
- JWT-хелперы живут в `src/utils/jwt.ts`, секрет обязателен (без дефолта). Для тестов используется `src/test-setup.ts`, который подставляет фейковый секрет.

## CI
- `.github/workflows/ci.yml` гоняет lint/unit/integration/e2e на Ubuntu, Node 20 и pnpm 9.
- Используются root-скрипты (`pnpm test:*`), перед e2e ставятся браузеры через `pnpm dlx playwright install --with-deps`.
- Ветка `main` и любые PR запускают пайплайн автоматически.

## Тулчейн
- Node.js ≥ 20, pnpm 9
- TypeScript 5.9.3 (strict)
- ESLint 9.39.1 (flat config, `eslint.config.mjs`) + @typescript-eslint/import/promise/prettier плагины, Airbnb-подобные правила
- Vitest для unit/интеграции, Playwright для e2e, Allure Report (будет подключён позже)

## Быстрый старт
```sh
pnpm install
```
После установки зависимостей доступны `pnpm dev:backend` и `pnpm dev:frontend`; пространство `tests/e2e` появится позже.

## Env переменные
Скопируй `.env.example` → `.env` и задай:
- `PORT` — порт backend (по умолчанию 4000)
- `JWT_SECRET` — секрет для подписи токенов (минимум 32 символа)
- `VITE_API_BASE` — базовый адрес API для фронта (например, `http://localhost:4000/api`)

## Правила качества
- TDD: сначала тест, затем код, потом рефакторинг.
- Arrange/Act/Assert, детерминизм, в e2e сохраняем скриншоты и трейсы.
- Conventional commits, не меняем структуру без обсуждения.

## Статус
- Стадия 1 (root scaffolding) завершена: базовые конфиги, workspace, линтинг и форматтер — ✅
- Стадия 1.2 (CI) завершена: GitHub Actions workflow создан и запускает все проверки — ✅
- Стадия 2.1 (Backend) завершена: Express-приложение и unit/integration тесты готовы — ✅
- Стадия 3.1 (Frontend skeleton) завершена: Vite + React + TS, базовый `App` ждёт реализации UI/логики — ✅
- Стадия 3.2 (Login flow) завершена: API-клиент, `useAuth`, UI-компоненты и страница `LoginPage` без роутера — ✅
- Далее: полноценные фронтенд-экраны, `tests/e2e` (Playwright) и отчётность Allure.
