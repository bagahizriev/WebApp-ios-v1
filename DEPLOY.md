# 🚀 Инструкция по деплою на GitHub Pages

## Быстрый старт

### 1. Создайте репозиторий на GitHub

- Перейдите на https://github.com/new
- Название: `pwa-calculator` (или любое другое)
- Оставьте репозиторий пустым (без README, .gitignore)

### 2. Подключите репозиторий

```bash
cd pwa-calculator
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/pwa-calculator.git
git push -u origin main
```

### 3. Настройте GitHub Pages

1. Откройте репозиторий на GitHub
2. **Settings** → **Pages**
3. **Source**: выберите **GitHub Actions**

### 4. Обновите путь (если нужно)

Если название репозитория НЕ `pwa-calculator`, откройте `vite.config.js` и измените:

```javascript
base: "/название-вашего-репозитория/",
scope: "/название-вашего-репозитория/",
start_url: "/название-вашего-репозитория/",
```

### 5. Запустите деплой

```bash
git add .
git commit -m "Update config"
git push
```

### 6. Готово!

Через 1-2 минуты приложение будет доступно:

```
https://ваш-username.github.io/pwa-calculator/
```

---

## Автоматический деплой

Используйте скрипт для быстрого деплоя:

```bash
./deploy.sh
```

Этот скрипт:

- ✅ Соберет проект
- ✅ Закоммитит изменения
- ✅ Отправит на GitHub
- ✅ Покажет ссылки для проверки

---

## Ручной деплой

### Каждый раз когда вы хотите обновить приложение:

```bash
# 1. Соберите проект
npm run build

# 2. Закоммитьте изменения
git add .
git commit -m "Update app"

# 3. Отправьте на GitHub
git push
```

GitHub Actions автоматически задеплоит изменения.

---

## Проверка деплоя

### Статус деплоя:

```
https://github.com/ваш-username/pwa-calculator/actions
```

### Ваше приложение:

```
https://ваш-username.github.io/pwa-calculator/
```

---

## Возможные проблемы

### ❌ Ошибка 404 после деплоя

**Решение**: Проверьте `base` в `vite.config.js` - должно совпадать с названием репозитория

### ❌ GitHub Actions не запускается

**Решение**:

1. Settings → Actions → General
2. Workflow permissions → Read and write permissions
3. Сохраните

### ❌ Белый экран после деплоя

**Решение**: Проверьте консоль браузера (F12). Обычно проблема в неправильном `base` пути.

---

## Обновление приложения

После любых изменений в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Деплой произойдет автоматически!

---

## Полезные команды

```bash
# Проверить статус git
git status

# Посмотреть историю коммитов
git log --oneline

# Посмотреть remote URL
git remote -v

# Локальный предпросмотр production сборки
npm run preview
```

---

## Что дальше?

После успешного деплоя:

1. 📱 Откройте приложение на iPhone в Safari
2. 🔽 Добавьте на домашний экран
3. ✅ Проверьте офлайн режим (включите режим полета)
4. 🎉 Готово!

Подробная инструкция по установке на iPhone: см. `ИНСТРУКЦИЯ.md`
