# ✅ Чеклист PWA для iOS - Важные моменты

## 🎯 1. Manifest.json - Критичные поля

### Обязательные для iOS:

```javascript
{
  "name": "Полное название приложения",
  "short_name": "Короткое",  // Макс 12 символов для иконки
  "display": "standalone",    // ⚠️ КРИТИЧНО! Без этого не будет полноэкранным
  "scope": "/",
  "start_url": "/",
  "theme_color": "#4a90e2",
  "background_color": "#ffffff"
}
```

**Важно:**

- `display: "standalone"` - убирает браузерную панель Safari
- `short_name` - то, что видно под иконкой на домашнем экране
- `scope` и `start_url` должны совпадать с base path в vite.config.js

---

## 📱 2. Apple-специфичные мета-теги (index.html)

```html
<!-- Включает режим веб-приложения -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Стиль статус-бара: default, black, black-translucent -->
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<!-- Название под иконкой (альтернатива short_name) -->
<meta name="apple-mobile-web-app-title" content="Калькулятор" />

<!-- Иконка для iOS (180x180 минимум) -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<!-- Viewport для iOS -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

**Важно:**

- `apple-mobile-web-app-capable="yes"` - обязательно для полноэкранного режима
- `apple-touch-icon` - иконка 180x180 или больше (iOS масштабирует сама)
- `user-scalable=no` - отключает зум (опционально, для app-like опыта)

---

## 🖼️ 3. Иконки - Размеры и форматы

### Минимальный набор:

```
192x192.png  - Android, базовый размер
512x512.png  - Android, высокое разрешение
180x180.png  - iOS (apple-touch-icon)
```

### Рекомендации:

- Формат: PNG с прозрачностью или без
- iOS автоматически скругляет углы - делайте квадратные иконки
- Не добавляйте тени или скругления сами
- Используйте простой дизайн - хорошо видно на маленьком размере

---

## 🔧 4. Service Worker - Обязательные настройки

```javascript
// vite.config.js
VitePWA({
    registerType: "autoUpdate", // Автообновление SW
    workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "google-fonts-cache",
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365,
                    },
                },
            },
        ],
    },
});
```

**Важно:**

- `registerType: 'autoUpdate'` - обновляет SW автоматически
- Кешируйте все статические ресурсы
- iOS ограничивает кеш ~50 МБ
- Кеш очищается если приложение не используется 2+ недели

---

## 💾 5. IndexedDB - Локальное хранилище

```javascript
// Используйте Dexie.js для простоты
import Dexie from "dexie";

const db = new Dexie("MyAppDB");
db.version(1).stores({
    items: "++id, name, date",
});
```

**Важно:**

- IndexedDB работает офлайн
- Данные сохраняются между сессиями
- Лимит ~50 МБ на iOS (может варьироваться)
- Используйте Dexie.js - проще чем нативный API

---

## 🌐 6. GitHub Pages - Настройка base path

### vite.config.js:

```javascript
export default defineConfig({
    base: "/repository-name/", // ⚠️ Должно совпадать с именем репо!
    plugins: [
        VitePWA({
            manifest: {
                scope: "/repository-name/",
                start_url: "/repository-name/",
            },
        }),
    ],
});
```

**Важно:**

- `base` должен совпадать с названием GitHub репозитория
- Все пути в manifest должны совпадать с base
- Для кастомного домена используйте `base: '/'`

---

## 📂 7. Структура проекта для GitHub Pages

```
repository-root/
├── .github/
│   └── workflows/
│       └── deploy.yml       # ⚠️ Workflow в корне!
├── public/
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── apple-touch-icon.png
├── src/
├── index.html
├── vite.config.js
└── package.json
```

**Важно:**

- Проект должен быть в корне репозитория, не в подпапке
- `.github/workflows/deploy.yml` должен быть в корне
- `dist/` генерируется при сборке

---

## 🚀 8. Установка на iOS - Требования

### Что нужно для кнопки "Add to Home Screen":

1. ✅ HTTPS (или localhost для разработки)
2. ✅ manifest.json с правильными полями
3. ✅ Service Worker зарегистрирован
4. ✅ Иконки 192x192 и 512x512
5. ✅ apple-touch-icon в HTML
6. ✅ Открыто в Safari (не Chrome!)

### Процесс установки:

1. Открыть в Safari на iPhone
2. Нажать кнопку "Поделиться" (квадрат со стрелкой)
3. Прокрутить вниз → "На экран «Домой»"
4. Нажать "Добавить"

---

## ⚠️ 9. Ограничения iOS (важно знать!)

### Что НЕ работает на iOS:

- ❌ Push-уведомления (пока не поддерживаются)
- ❌ Background Sync
- ❌ Web Bluetooth
- ❌ Установка из Chrome/Firefox (только Safari)
- ❌ Кеш больше ~50 МБ

### Что работает:

- ✅ Service Worker (кеширование)
- ✅ IndexedDB (локальное хранилище)
- ✅ Geolocation API
- ✅ Camera API
- ✅ Полноэкранный режим
- ✅ Офлайн работа

---

## 🔍 10. Отладка PWA на iOS

### Через Safari на Mac:

1. iPhone → Настройки → Safari → Дополнения → Web Inspector (включить)
2. Mac → Safari → Настройки → Дополнения → Показать меню "Разработка"
3. Подключить iPhone по USB
4. Safari → Разработка → [Ваш iPhone] → [Страница]

### Проверка в консоли:

```javascript
// Service Worker активен?
navigator.serviceWorker.controller;

// Проверка manifest
navigator.serviceWorker.ready.then((reg) => console.log(reg));

// IndexedDB работает?
indexedDB.databases();
```

---

## 📋 11. Быстрый чеклист перед деплоем

- [ ] `manifest.json` с `display: "standalone"`
- [ ] Мета-теги Apple в `index.html`
- [ ] Иконки 192x192, 512x512, 180x180
- [ ] Service Worker регистрируется в `main.jsx`
- [ ] `base` в `vite.config.js` совпадает с репозиторием
- [ ] Проект в корне репозитория (не в подпапке)
- [ ] GitHub Pages настроен на "GitHub Actions"
- [ ] HTTPS включен (автоматически на GitHub Pages)
- [ ] Тестирование в Safari на iPhone

---

## 🎨 12. Best Practices для iOS PWA

### UI/UX:

```css
/* Безопасная зона для iPhone с вырезом */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);

/* Отключить выделение текста (app-like) */
-webkit-user-select: none;
user-select: none;

/* Отключить callout при долгом нажатии */
-webkit-touch-callout: none;

/* Плавная прокрутка */
-webkit-overflow-scrolling: touch;
```

### Производительность:

- Минимизируйте размер bundle (code splitting)
- Используйте lazy loading для изображений
- Кешируйте статические ресурсы агрессивно
- Оптимизируйте изображения (WebP с PNG fallback)

---

## 🔄 13. Обновление PWA

### Автоматическое обновление:

```javascript
// vite.config.js
VitePWA({
    registerType: "autoUpdate", // Обновляется автоматически
});
```

### Ручное обновление (опционально):

```javascript
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("Доступно обновление. Обновить?")) {
            updateSW(true);
        }
    },
});
```

---

## 📊 14. Мониторинг и аналитика

### Проверка установки:

```javascript
// Проверить, запущено ли как PWA
if (window.matchMedia("(display-mode: standalone)").matches) {
    console.log("Запущено как PWA");
}

// Или через navigator
if (navigator.standalone) {
    console.log("Запущено как PWA на iOS");
}
```

---

## 🎯 Итоговый минимальный набор для iOS PWA:

1. **manifest.json** с `display: "standalone"`
2. **Service Worker** (через vite-plugin-pwa)
3. **Иконки**: 192x192, 512x512, apple-touch-icon
4. **Мета-теги Apple** в index.html
5. **HTTPS** (автоматически на GitHub Pages)
6. **Правильный base path** в vite.config.js
7. **Открыть в Safari** для установки

Следуя этому чеклисту, ваше PWA будет корректно работать на iOS! 🚀
