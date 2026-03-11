# 🎯 PWA на iOS - Технические требования (минимум)

> Фреймворк, сборщик, UI - не важно. Важно только это:

---

## 1️⃣ IndexedDB - Хранилище данных

### Почему IndexedDB?

- ✅ Единственный надежный способ хранения данных офлайн на iOS
- ✅ Лимит ~50 МБ (достаточно для большинства приложений)
- ✅ Асинхронный API (не блокирует UI)
- ✅ Поддерживает индексы и транзакции

### Альтернативы НЕ работают:

- ❌ **localStorage** - лимит 5-10 МБ, может очиститься iOS
- ❌ **sessionStorage** - удаляется при закрытии вкладки
- ❌ **Cookies** - лимит 4 КБ, не для больших данных
- ❌ **WebSQL** - deprecated, не поддерживается

### Нативный API (сложный):

```javascript
const request = indexedDB.open("MyDatabase", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["items"], "readwrite");
    const objectStore = transaction.objectStore("items");
    objectStore.add({ name: "Item 1", value: 100 });
};
```

### Dexie.js (рекомендуется):

```javascript
import Dexie from "dexie";

const db = new Dexie("MyDatabase");
db.version(1).stores({
    items: "++id, name, date",
});

// Добавить
await db.items.add({ name: "Item 1", date: new Date() });

// Получить все
const items = await db.items.toArray();

// Получить по ID
const item = await db.items.get(1);

// Удалить
await db.items.delete(1);

// Очистить все
await db.items.clear();
```

**Установка:**

```bash
npm install dexie
```

---

## 2️⃣ Service Worker - Офлайн работа

### Зачем нужен?

- ✅ Кеширование файлов для офлайн работы
- ✅ Перехват сетевых запросов
- ✅ Обязателен для PWA на iOS

### Вариант 1: Вручную (сложно)

```javascript
// sw.js
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then((cache) => {
            return cache.addAll(["/", "/index.html", "/styles.css", "/app.js"]);
        }),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }),
    );
});

// Регистрация в main.js
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}
```

### Вариант 2: Workbox (проще)

```javascript
// sw.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(({ request }) => request.destination === "image", new CacheFirst());
```

### Вариант 3: vite-plugin-pwa (самый простой для Vite)

```javascript
// vite.config.js
import { VitePWA } from "vite-plugin-pwa";

export default {
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
        }),
    ],
};

// main.js
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
```

**Установка:**

```bash
npm install -D vite-plugin-pwa
```

---

## 3️⃣ manifest.json - Описание приложения

### Минимальный набор полей:

```json
{
    "name": "Полное название приложения",
    "short_name": "Короткое",
    "description": "Описание приложения",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "theme_color": "#4a90e2",
    "background_color": "#ffffff",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### Критичные поля для iOS:

- **`display: "standalone"`** - убирает браузерную панель (обязательно!)
- **`short_name`** - макс 12 символов, показывается под иконкой
- **`icons`** - минимум 192x192 и 512x512

### Подключение в HTML:

```html
<link rel="manifest" href="/manifest.json" />
```

---

## 4️⃣ Apple мета-теги - Специфика iOS

### Обязательные теги в `<head>`:

```html
<!-- Включает режим веб-приложения -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Стиль статус-бара: default | black | black-translucent -->
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<!-- Название под иконкой (альтернатива short_name) -->
<meta name="apple-mobile-web-app-title" content="Мое Приложение" />

<!-- Иконка для iOS (минимум 180x180) -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<!-- Viewport для корректного отображения -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Цвет темы -->
<meta name="theme-color" content="#4a90e2" />
```

### Размеры иконок:

- **192x192.png** - для Android
- **512x512.png** - для Android (высокое разрешение)
- **180x180.png** - для iOS (apple-touch-icon)

**Важно:** iOS автоматически скругляет углы, не делайте это сами!

---

## 5️⃣ HTTPS - Обязательное требование

### Почему HTTPS?

- Service Worker работает **только** по HTTPS
- Исключение: `localhost` для разработки

### Где получить HTTPS бесплатно:

- ✅ **GitHub Pages** - автоматически
- ✅ **Vercel** - автоматически
- ✅ **Netlify** - автоматически
- ✅ **Cloudflare Pages** - автоматически
- ✅ **Let's Encrypt** - для своего сервера

---

## 📦 Установка - Минимальный пакет зависимостей

```bash
# Только для хранения данных
npm install dexie

# Только для Service Worker (если используете Vite)
npm install -D vite-plugin-pwa
```

**Все!** Больше ничего специфичного для PWA не нужно.

---

## 🔧 Минимальный код для PWA

### 1. IndexedDB (db.js):

```javascript
import Dexie from "dexie";

export const db = new Dexie("MyAppDB");
db.version(1).stores({
    items: "++id, name, date",
});
```

### 2. Service Worker (vite.config.js):

```javascript
import { VitePWA } from "vite-plugin-pwa";

export default {
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "My App",
                short_name: "App",
                display: "standalone",
                icons: [
                    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
                    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
                ],
            },
        }),
    ],
};
```

### 3. Регистрация SW (main.js):

```javascript
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
```

### 4. HTML мета-теги (index.html):

```html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My App" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
    </head>
    <body>
        <!-- Ваше приложение -->
    </body>
</html>
```

---

## ✅ Чеклист перед деплоем

- [ ] IndexedDB настроен (Dexie или нативный API)
- [ ] Service Worker зарегистрирован
- [ ] manifest.json с `display: "standalone"`
- [ ] Apple мета-теги в HTML
- [ ] Иконки: 192x192, 512x512, 180x180
- [ ] HTTPS включен
- [ ] Тестирование в Safari на iPhone

---

## 🚫 Что НЕ нужно для PWA

- ❌ Специальный фреймворк (React/Vue/Svelte - любой подойдет)
- ❌ Специальный сборщик (Vite/Webpack/Rollup - любой подойдет)
- ❌ Backend сервер (можно чисто статический сайт)
- ❌ База данных на сервере (IndexedDB локально)
- ❌ Регистрация в App Store
- ❌ Платные сертификаты

---

## 🎯 Итого - 5 технических требований:

1. **IndexedDB** - хранилище данных
2. **Service Worker** - офлайн работа
3. **manifest.json** - описание приложения
4. **Apple мета-теги** - для iOS
5. **HTTPS** - обязательно

**Все остальное - на ваш выбор!**

Фреймворк, UI-библиотека, сборщик, хостинг - не влияют на PWA функциональность.

---

## 📚 Полезные ссылки

- [Dexie.js документация](https://dexie.org/)
- [Workbox документация](https://developers.google.com/web/tools/workbox)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [MDN: IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 🔍 Проверка PWA

### В браузере (DevTools):

```javascript
// Service Worker активен?
navigator.serviceWorker.controller;

// IndexedDB работает?
indexedDB.databases();

// Запущено как PWA?
window.matchMedia("(display-mode: standalone)").matches;
```

### Lighthouse (Chrome DevTools):

1. F12 → Lighthouse
2. Выбрать "Progressive Web App"
3. Generate report

Должно быть 100/100 для корректной работы на iOS!
