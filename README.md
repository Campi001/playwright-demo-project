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
> Пакеты в `apps/*` и `tests/*` будут добавлены на следующих этапах, поэтому эти команды являются заглушками до появления соответствующих workspace-проектов.

## CI
- `.github/workflows/ci.yml` гоняет lint/unit/integration/e2e на Ubuntu, Node 20 и pnpm 9.
- Используются root-скрипты (`pnpm test:*`), перед e2e ставятся браузеры `pnpm exec playwright install --with-deps`.
- Ветка `main` и любые PR запускают пайплайн автоматически.

## Тулчейн
- Node.js ≥ 20, pnpm 9
- TypeScript 5.9.3 (strict)
- ESLint 9.39.1 + кастомная конфигурация (eslint:recommended + import/promise + @typescript-eslint + набор Airbnb-подобных правил) + Prettier 3.6.2
- Vitest для unit/интеграции, Playwright для e2e, Allure Report (будет подключён позже)

## Быстрый старт
```sh
pnpm install
```
Пока достаточно установки зависимостей; дев‑серверы появятся после создания приложений в `apps/`.

## Env переменные
Скопируй `.env.example` → `.env` и задай:
- `PORT` — порт backend (по умолчанию 4000)
- `JWT_SECRET` — секрет для подписи токенов
- `VITE_API_BASE_URL` — адрес API для фронта

## Правила качества
- TDD: сначала тест, затем код, потом рефакторинг.
- Arrange/Act/Assert, детерминизм, в e2e сохраняем скриншоты и трейсы.
- Conventional commits, не меняем структуру без обсуждения.

## Статус
- Стадия 1 (root scaffolding) завершена: базовые конфиги, workspace, линтинг и форматтер — ✅
- Стадия 1.2 (CI) завершена: GitHub Actions workflow создан и запускает все проверки — ✅
- Далее: имплементация backend/frontend приложений, тестов и отчётности.
