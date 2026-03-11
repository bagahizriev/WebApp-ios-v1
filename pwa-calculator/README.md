# 📊 PWA Калькулятор Формул

Простое Progressive Web App (PWA) приложение-калькулятор с поддержкой офлайн режима и сохранением истории вычислений в IndexedDB.

## ✨ Возможности

- ✅ Работает как PWA (Progressive Web App)
- ✅ Полная поддержка офлайн режима
- ✅ Установка на домашний экран iPhone/Android
- ✅ Сохранение истории в IndexedDB
- ✅ 4 типа операций: сложение, умножение, степень, среднее
- ✅ Адаптивный дизайн
- ✅ Быстрая работа благодаря Vite

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение откроется по адресу: http://localhost:5173

### Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

### Предпросмотр production сборки

```bash
npm run preview
```

## 📦 Деплой на GitHub Pages

### Шаг 1: Подготовка репозитория

1. Создайте новый репозиторий на GitHub
2. Инициализируйте git в проекте:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/pwa-calculator.git
git push -u origin main
```

### Шаг 2: Настройка GitHub Pages

1. Откройте настройки репозитория на GitHub
2. Перейдите в раздел **Settings** → **Pages**
3. В разделе **Source** выберите **GitHub Actions**

### Шаг 3: Обновите base в vite.config.js

Откройте `vite.config.js` и измените `base` на название вашего репозитория:

```javascript
export default defineConfig({
    base: "/название-вашего-репозитория/",
    // ...
});
```

Также обновите `scope` и `start_url` в манифесте в том же файле.

### Шаг 4: Деплой

После push в ветку `main`, GitHub Actions автоматически соберет и задеплоит приложение.

Ваше приложение будет доступно по адресу:

```
https://ваш-username.github.io/название-репозитория/
```

## 📱 Установка на iPhone

### Способ 1: Safari

1. Откройте приложение в Safari на iPhone
2. Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх)
3. Прокрутите вниз и выберите **"На экран «Домой»"** (Add to Home Screen)
4. Нажмите **"Добавить"**

### Способ 2: Chrome (iOS)

1. Откройте приложение в Chrome на iPhone
2. Нажмите на три точки (меню)
3. Выберите **"Добавить на главный экран"**
4. Нажмите **"Добавить"**

После установки:

- Приложение появится на домашнем экране как обычное приложение
- Будет работать в полноэкранном режиме без браузерной панели
- Будет работать офлайн после первой загрузки

## 🛠 Технологии

- **React** - UI библиотека
- **Vite** - сборщик и dev сервер
- **Dexie.js** - обертка для IndexedDB
- **vite-plugin-pwa** - плагин для генерации PWA
- **Workbox** - Service Worker для кеширования

## 📂 Структура проекта

```
pwa-calculator/
├── public/
│   ├── pwa-192x192.png      # Иконка 192x192
│   ├── pwa-512x512.png      # Иконка 512x512
│   └── apple-touch-icon.png # Иконка для iOS
├── src/
│   ├── App.jsx              # Главный компонент
│   ├── App.css              # Стили
│   ├── db.js                # Настройка IndexedDB
│   ├── main.jsx             # Точка входа
│   └── index.css            # Глобальные стили
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions для деплоя
├── vite.config.js           # Конфигурация Vite и PWA
└── package.json
```

## 🔧 Настройка PWA

Все настройки PWA находятся в `vite.config.js`:

- **manifest** - метаданные приложения (название, иконки, цвета)
- **workbox** - настройки Service Worker и кеширования
- **registerType** - режим обновления Service Worker

## 🐛 Отладка

### Проверка Service Worker

1. Откройте DevTools (F12)
2. Перейдите во вкладку **Application** → **Service Workers**
3. Убедитесь, что Service Worker активен

### Проверка IndexedDB

1. Откройте DevTools (F12)
2. Перейдите во вкладку **Application** → **Storage** → **IndexedDB**
3. Найдите базу данных **CalculatorDB**

### Проверка манифеста

1. Откройте DevTools (F12)
2. Перейдите во вкладку **Application** → **Manifest**
3. Проверьте все поля манифеста

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Создано с помощью Vite + React + PWA
