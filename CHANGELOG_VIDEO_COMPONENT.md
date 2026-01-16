# Changelog — YouTube Video Component

## [1.0.0] - 2026-01-16

### ✅ Создано

#### Новые файлы:

1. **`src/scss/components/_video.scss`**
   - Универсальный SCSS компонент для YouTube видео
   - BEM структура классов
   - Responsive стили
   - Модификаторы для lite-youtube

2. **`src/js/modules/video-play.js`**
   - Обновленный JS модуль с автоматической инициализацией
   - Поддержка data-атрибутов
   - Автоматическое создание элементов (iframe, постер, кнопка)
   - Обратная совместимость со старым кодом

3. **`src/pug/mixins/_yt-video.pug`**
   - Pug миксин для упрощения использования
   - Параметры: videoId, poster, autoplay, additionalClasses
   - Чистый и краткий синтаксис

4. **`src/scss/components/_video.README.md`**
   - Подробная техническая документация
   - Примеры использования
   - Data-атрибуты
   - Кастомизация стилей

5. **`YOUTUBE_VIDEO_COMPONENT.md`**
   - Краткое руководство пользователя
   - Быстрый старт
   - Примеры кода

6. **`CHANGELOG_VIDEO_COMPONENT.md`**
   - История изменений
   - Список обновленных файлов

---

### 🔄 Обновлено

#### Обновленные файлы:

1. **`src/scss/main.scss`**
   - Добавлен импорт `@import 'components/video';`

2. **`src/pug/pages/index.pug`**
   - Обновлена Hero секция (строки 13-17)
   - Обновлена Video секция (строки 217-221)
   - Использован новый миксин `+yt-video()`

3. **`src/scss/pages/_home.scss`**
   - Упрощены стили `.hero__video-wrapper`
   - Удалены дубликаты (`.hero__video-image`, `.hero__video`, `.hero__play-btn`)
   - Упрощены стили `.video-section__wrapper`
   - Удалены дубликаты (`.video-section__video`, `.video-section__play-btn`)

4. **`src/pug/pages/about-company.pug`**
   - Добавлен класс `.yt-video--lite` для lite-youtube компонента

5. **`src/scss/pages/_about-company.scss`**
   - Упрощены стили `.about-company-section__video`
   - Удалены дубликаты стилей lite-youtube (теперь в `_video.scss`)

---

### 📦 Структура компонента

#### HTML классы:

```
.yt-video                    // Контейнер
├── .yt-video__poster        // Постер (генерируется JS)
├── .yt-video__iframe        // YouTube iframe (генерируется JS)
└── .yt-video__play-btn      // Кнопка Play (генерируется JS)
    └── i.fal.fa-circle-play // Font Awesome иконка
```

#### Модификаторы:

```
.yt-video--lite              // Для lite-youtube компонента
```

#### Data-атрибуты:

```html
data-video-id="VIDEO_ID"                  // YouTube ID (обязательно)
data-poster="path/to/poster.webp"         // Постер (опционально)
data-autoplay="true"                       // Автозапуск (опционально)
```

---

### 🎯 Использование

#### Минимальный вариант:

```pug
include ../mixins/_yt-video

+yt-video('wfsTGsXGKvE')
```

#### С постером:

```pug
+yt-video('wfsTGsXGKvE', 'assets/img/webp/poster.webp')
```

#### С автозапуском:

```pug
+yt-video('wfsTGsXGKvE', 'assets/img/webp/poster.webp', true)
```

#### С дополнительными классами:

```pug
+yt-video('wfsTGsXGKvE', null, false, 'custom-class')
```

---

### 🔧 Технические детали

#### JavaScript:

- Автоматический поиск `.yt-video[data-video-id]`
- Создание элементов если их нет в DOM
- Обработчик клика на `.yt-video__play-btn`
- Автозапуск видео при клике
- Скрытие постера и кнопки при запуске
- Обратная совместимость со старыми классами

#### SCSS:

- Полная BEM структура
- Responsive дизайн
- Hover эффекты
- Transitions
- Модификаторы для lite-youtube

---

### 🎨 Иконки

#### Основной компонент:

Font Awesome 7 Pro `.fa-circle-play` (большая круглая иконка)

#### lite-youtube:

Font Awesome 7 Pro `\f04b` (play треугольник)

---

### ✨ Преимущества

1. ✅ **Простота** — один миксин вместо копипаста HTML
2. ✅ **Универсальность** — работает на любой странице
3. ✅ **Автоматизация** — JS автоматически создает все элементы
4. ✅ **Без изменений JS** — добавили видео в HTML и всё работает
5. ✅ **BEM структура** — чистые BEM классы
6. ✅ **Обратная совместимость** — старый код работает
7. ✅ **Оптимизация** — поддержка lite-youtube

---

### 📋 Миграция старого кода

#### Было:

```pug
.hero__video-wrapper
  img.hero__video-image(src="assets/img/webp/hero-bg.webp")
  iframe.hero__video(src="https://www.youtube.com/embed/VIDEO_ID")
  .hero__overlay
a.hero__play-btn(href="#")
  i.fal.fa-circle-play
```

#### Стало:

```pug
include ../mixins/_yt-video

.hero__video-wrapper
  +yt-video('VIDEO_ID', 'assets/img/webp/hero-bg.webp')
  .hero__overlay
```

**Результат:** -5 строк кода, +100% автоматизация

---

### 🚀 Проверка работы

1. Запустите dev сервер: `npm run dev`
2. Откройте `http://localhost:3003`
3. Проверьте Hero секцию (index.html)
4. Проверьте Video секцию (index.html)
5. Проверьте About Company (about-company.html)

---

### 📚 Документация

- **Краткое руководство:** `YOUTUBE_VIDEO_COMPONENT.md`
- **Техническая документация:** `src/scss/components/_video.README.md`
- **Changelog:** `CHANGELOG_VIDEO_COMPONENT.md`

---

### 🔍 Где используется

1. **index.pug** — Hero секция (строка 16)
2. **index.pug** — Video секция (строка 622 в HTML)
3. **about-company.pug** — lite-youtube (строка 27)

---

### ⚙️ Совместимость

- ✅ Все браузеры (Chrome, Firefox, Safari, Edge)
- ✅ Все устройства (Desktop, Tablet, Mobile)
- ✅ Font Awesome 7 Pro
- ✅ lite-youtube компонент
- ✅ Обратная совместимость со старым кодом

---

### 🎉 Готово к использованию!

Теперь для добавления YouTube видео достаточно одной строки:

```pug
+yt-video('VIDEO_ID', 'poster.webp')
```

**Всё остальное сделает автоматика!** 🚀
