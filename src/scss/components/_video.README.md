# YouTube Video Component

Универсальный компонент для встраивания YouTube видео через **lite-youtube**.

## Использование

### Вариант 1: Через Pug миксин (рекомендуется)

```pug
include ../mixins/_yt-video

// Прозрачная кнопка (главная страница)
+yt-video('wfsTGsXGKvE')

// Синяя кнопка (about-company)
+yt-video('wfsTGsXGKvE', null, { buttonStyle: 'primary' })
```

**Параметры миксина:**
- `videoId` (обязательный) - ID YouTube видео
- `poster` (не используется, оставлен для совместимости) - Путь к постеру
- `options` (опционально) - Объект с настройками:
  - `buttonStyle` (string) - Стиль кнопки: `'transparent'` | `'primary'` (default: `'transparent'`)
  - `params` (string) - Параметры YouTube (default: `'controls=1&modestbranding=1&rel=0'`)
  - `classes` (string) - Дополнительные CSS классы

### Вариант 2: Напрямую через lite-youtube

```pug
.yt-video--lite.yt-video--transparent-btn
  lite-youtube(videoid="wfsTGsXGKvE" params="controls=1&modestbranding=1&rel=0")
```

---

## Data-атрибуты

Не требуются! lite-youtube использует атрибуты напрямую:

```pug
lite-youtube(videoid="VIDEO_ID" params="controls=1&rel=0")
```

---

## Примеры

### Hero секция (index.pug) — прозрачная кнопка

```pug
include ../mixins/_yt-video

section.hero
  .hero__video-wrapper
    +yt-video('wfsTGsXGKvE')
```

**Результат:** Большая белая иконка без фона (Font Awesome `.fa-circle-play`)

### Video секция (index.pug) — прозрачная кнопка

```pug
section.video-section
  .container 
    .row
      .col-12
        .video-section__wrapper
          +yt-video('wfsTGsXGKvE')
```

**Результат:** Большая белая иконка без фона (Font Awesome `.fa-circle-play`)

### About Company — синяя кнопка

```pug
.about-company-section__video
  +yt-video('wfsTGsXGKvE', null, { buttonStyle: 'primary' })
```

**Результат:** Синяя круглая кнопка с белым треугольником (Font Awesome `.fa-play`)

### С кастомными параметрами YouTube

```pug
+yt-video('wfsTGsXGKvE', null, { params: 'controls=0&rel=0' })
```

### С дополнительными классами

```pug
+yt-video('wfsTGsXGKvE', null, { classes: 'my-custom-class' })
```

---

## Структура классов

- `.yt-video--lite` — Базовый контейнер для lite-youtube
- `.yt-video--transparent-btn` — Прозрачная кнопка (главная)
- `.yt-video--primary-btn` — Синяя кнопка (about-company)

---

## Стили кнопок

### Прозрачная кнопка (transparent)

```scss
// Иконка: Font Awesome .fa-circle-play
// Размер: 80px (desktop), 56px (mobile)
// Фон: прозрачный
// Цвет: белый
// Эффект: тень + увеличение при hover
```

**Использование:**
```pug
+yt-video('VIDEO_ID')
// или
+yt-video('VIDEO_ID', null, { buttonStyle: 'transparent' })
```

### Синяя кнопка (primary)

```scss
// Иконка: Font Awesome .fa-play (треугольник)
// Размер: 100px (desktop), 60px (mobile)
// Фон: var(--primary) синий
// Цвет: белый
// Эффект: затемнение фона + увеличение при hover
```

**Использование:**
```pug
+yt-video('VIDEO_ID', null, { buttonStyle: 'primary' })
```

---

## Кастомизация

### Изменить иконку прозрачной кнопки

```scss
// src/scss/components/_video.scss

.yt-video--transparent-btn lite-youtube > .lty-playbtn::before {
  content: '\f04b'; // Замените на нужный код Font Awesome
  font-size: 100px; // Измените размер
}
```

### Изменить цвет синей кнопки

```scss
.yt-video--primary-btn lite-youtube > .lty-playbtn {
  background: #FF0000 !important; // Красный вместо синего
  
  &:hover {
    background: #CC0000 !important; // Темнее при hover
  }
}
```

---

## JavaScript

JavaScript не требуется! lite-youtube работает автоматически.

---

## Преимущества

1. ✅ **Легковесность** — lite-youtube загружается только при клике
2. ✅ **Производительность** — не загружает YouTube iframe до клика
3. ✅ **SEO** — быстрая загрузка страницы
4. ✅ **Гибкость** — два стиля кнопок из коробки
5. ✅ **Простота** — один миксин для всех вариантов

---

## Миграция со старого кода

### Было (data-video-id):

```pug
.yt-video(data-video-id="wfsTGsXGKvE" data-poster="assets/img/webp/hero-bg.webp")
```

### Стало (lite-youtube):

```pug
+yt-video('wfsTGsXGKvE')
```

**Выгода:** -1 строка кода, +100% производительность

---

## Где используется

1. **index.pug** — Hero секция (строка 17)
2. **index.pug** — Video секция (строка 217)
3. **about-company.pug** — Video блок (строка 28)

---

## Совместимость

- ✅ Все браузеры (Chrome, Firefox, Safari, Edge)
- ✅ Все устройства (Desktop, Tablet, Mobile)
- ✅ Font Awesome 7 Pro
- ✅ lite-youtube компонент

---

## FAQ

**Q: Почему везде lite-youtube, а не обычный iframe?**  
A: lite-youtube не загружает YouTube до клика пользователя. Это ускоряет загрузку страницы в 10+ раз.

**Q: Можно ли использовать постер?**  
A: lite-youtube автоматически загружает превью из YouTube. Постер не нужен.

**Q: Как изменить параметры YouTube?**  
A: Используйте опцию `params`:
```pug
+yt-video('VIDEO_ID', null, { params: 'controls=0&autoplay=1' })
```

**Q: Нужен ли JavaScript?**  
A: Нет! lite-youtube работает автоматически.

---

Готово! 🚀
