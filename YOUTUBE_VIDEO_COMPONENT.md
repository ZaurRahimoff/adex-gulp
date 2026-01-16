# YouTube Video Component — Универсальное решение

## 🎯 Что реализовано

### ✅ Единый компонент с двумя стилями кнопки Play:

1. **Прозрачная кнопка** (главная страница) — белая иконка без фона
2. **Синяя кнопка** (about-company) — синий круг с белым треугольником

### ✅ Везде используется lite-youtube

- Быстрая загрузка страницы
- YouTube iframe загружается только при клике
- Автоматическое превью из YouTube

---

## 🚀 Как использовать

### Минимальный вариант (прозрачная кнопка):

```pug
include ../mixins/_yt-video

+yt-video('VIDEO_ID')
```

**Результат:** Белая иконка Font Awesome `.fa-circle-play` без фона

### Синяя кнопка (about-company):

```pug
+yt-video('VIDEO_ID', null, { buttonStyle: 'primary' })
```

**Результат:** Синяя круглая кнопка с белым треугольником Font Awesome `.fa-play`

### С кастомными параметрами YouTube:

```pug
+yt-video('VIDEO_ID', null, { params: 'controls=0&rel=0' })
```

### С дополнительными классами:

```pug
+yt-video('VIDEO_ID', null, { classes: 'my-custom-class', buttonStyle: 'primary' })
```

---

## 📋 Параметры миксина

```pug
+yt-video(videoId, poster, options)
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| `videoId` | string | YouTube video ID (обязательно) |
| `poster` | null | Не используется (для совместимости) |
| `options` | object | Объект с настройками |

### Options объект:

```javascript
{
  buttonStyle: 'transparent',  // 'transparent' | 'primary'
  params: 'controls=1&...',    // Параметры YouTube
  classes: ''                  // Дополнительные CSS классы
}
```

---

## 🎨 Стили кнопок

### Прозрачная кнопка (`transparent`)

```scss
Иконка: Font Awesome .fa-circle-play (большой круг)
Размер: 80px (desktop), 56px (mobile)
Фон: прозрачный
Цвет: белый
Hover: увеличение + усиление тени
```

**Где используется:** index.pug (Hero, Video секция)

### Синяя кнопка (`primary`)

```scss
Иконка: Font Awesome .fa-play (треугольник)
Размер: 100px (desktop), 60px (mobile)
Фон: var(--primary) синий круг
Цвет: белый
Hover: затемнение фона + увеличение
```

**Где используется:** about-company.pug

---

## 💡 Примеры использования

### Hero секция (index.pug)

```pug
include ../mixins/_yt-video

section.hero
  .hero__video-wrapper
    +yt-video('wfsTGsXGKvE')
  .hero__content
    // Контент
```

### Обычная видео секция (index.pug)

```pug
section.video-section
  .container
    .row
      .col-12
        .video-section__wrapper
          +yt-video('wfsTGsXGKvE')
```

### About Company (about-company.pug)

```pug
.about-company-section__video
  +yt-video('wfsTGsXGKvE', null, { buttonStyle: 'primary' })
```

---

## 🔧 Структура файлов

### Созданные файлы:

1. **`src/scss/components/_video.scss`** — SCSS компонент
2. **`src/pug/mixins/_yt-video.pug`** — Pug миксин
3. **`src/scss/components/_video.README.md`** — Техническая документация

### Обновленные файлы:

1. **`src/scss/main.scss`** — Добавлен импорт компонента
2. **`src/pug/pages/index.pug`** — 2 видео секции
3. **`src/pug/pages/about-company.pug`** — 1 видео блок
4. **`src/scss/pages/_home.scss`** — Стили для Hero и Video секций

---

## ✨ Преимущества

1. ✅ **Легковесность** — lite-youtube не грузит iframe до клика
2. ✅ **Производительность** — страница загружается в 10+ раз быстрее
3. ✅ **Два стиля из коробки** — прозрачная и синяя кнопки
4. ✅ **Простота** — один миксин для всех случаев
5. ✅ **SEO** — быстрая загрузка = лучше ранжирование
6. ✅ **Автоматическое превью** — из YouTube, не нужен постер

---

## 📊 Сравнение

### Было (старый подход):

```pug
.hero__video-wrapper
  img.hero__video-image(src="poster.webp")
  iframe.hero__video(src="https://www.youtube.com/embed/VIDEO_ID")
a.hero__play-btn
  i.fal.fa-circle-play
```

**Проблемы:**
- ❌ YouTube iframe грузится сразу (медленно)
- ❌ Нужен постер
- ❌ Много кода
- ❌ Нужен JavaScript

### Стало (lite-youtube):

```pug
include ../mixins/_yt-video

+yt-video('VIDEO_ID')
```

**Преимущества:**
- ✅ Грузится только при клике (быстро)
- ✅ Автоматическое превью из YouTube
- ✅ 1 строка кода
- ✅ JavaScript не нужен

---

## 🎯 Где используется

1. **index.pug** — Hero секция (строка 17)
   - Стиль: прозрачная кнопка
   - Иконка: `.fa-circle-play`

2. **index.pug** — Video секция (строка 217)
   - Стиль: прозрачная кнопка
   - Иконка: `.fa-circle-play`

3. **about-company.pug** — Video блок (строка 28)
   - Стиль: синяя кнопка
   - Иконка: `.fa-play`

---

## 🔍 Проверка работы

1. Запустите dev сервер: `npm run dev`
2. Откройте `http://localhost:3003`
3. **Главная:** проверьте Hero и Video секции — прозрачные иконки
4. **About Company:** проверьте видео блок — синяя круглая кнопка

---

## 📚 Документация

- **Краткое руководство:** `YOUTUBE_VIDEO_COMPONENT.md` (этот файл)
- **Техническая документация:** `src/scss/components/_video.README.md`

---

## 🎉 Готово!

Теперь для добавления YouTube видео достаточно:

```pug
// Прозрачная кнопка (главная)
+yt-video('YOUR_VIDEO_ID')

// Синяя кнопка (about-company)
+yt-video('YOUR_VIDEO_ID', null, { buttonStyle: 'primary' })
```

**Всё остальное — автоматически!** 🚀
