#!/bin/bash

echo "🚀 Деплой PWA Calculator на GitHub Pages"
echo ""

# Проверка git remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote не настроен!"
    echo "Выполните:"
    echo "  git remote add origin https://github.com/ваш-username/pwa-calculator.git"
    exit 1
fi

echo "📦 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки!"
    exit 1
fi

echo "✅ Сборка завершена"
echo ""
echo "📤 Отправка на GitHub..."

git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push

echo ""
echo "✅ Готово! Проверьте статус деплоя:"
echo "   https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""
echo "📱 После завершения деплоя приложение будет доступно по адресу:"
echo "   https://$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f1).github.io/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f2)/"
