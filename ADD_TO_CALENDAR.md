# Add to Calendar Component

Компонент для добавления событий в различные календари с поддержкой передачи параметров через HTML data-атрибуты.

## Использование

### 1. Через Pug миксин (рекомендуется)

```pug
include ../mixins/_add-to-calendar

+add-to-calendar(
  'Event Title',                    // Название события
  'Event Description',              // Описание
  'Event Location',                 // Местоположение
  '2025-06-03T09:00:00',           // Дата начала (ISO 8601)
  '2025-06-05T18:00:00',           // Дата окончания (ISO 8601)
  'Asia/Baku',                      // Часовой пояс
  '3-5 June, 2025'                  // Текст для отображения
)
```

### 2. Через HTML напрямую

```html
<div class="topbar__calendar dropdown"
     data-event-title="Event Title"
     data-event-description="Event Description"
     data-event-location="Event Location"
     data-event-start="2025-06-03T09:00:00"
     data-event-end="2025-06-05T18:00:00"
     data-event-timezone="Asia/Baku">
  
  <button class="topbar__calendar-btn" 
          type="button" 
          data-bs-toggle="dropdown">
    <i class="fa-regular fa-calendar-plus"></i>
    <span>3-5 June, 2025</span>
  </button>
  
  <ul class="topbar__calendar-dropdown dropdown-menu">
    <li><a href="#" data-calendar="google">Google Calendar</a></li>
    <li><a href="#" data-calendar="ical">Apple Calendar</a></li>
    <li><a href="#" data-calendar="outlook">Outlook Calendar</a></li>
    <li><a href="#" data-calendar="outlookcom">Outlook.com</a></li>
    <li><a href="#" data-calendar="yahoo">Yahoo Calendar</a></li>
  </ul>
</div>
```

## Параметры

### Data-атрибуты

| Атрибут | Тип | Обязательный | Описание | Пример |
|---------|-----|--------------|----------|--------|
| `data-event-title` | string | Да | Название события | `"ADEX 2025"` |
| `data-event-description` | string | Нет | Описание события | `"International Exhibition"` |
| `data-event-location` | string | Нет | Место проведения | `"Baku Expo Center"` |
| `data-event-start` | ISO 8601 | Да | Дата и время начала | `"2025-06-03T09:00:00"` |
| `data-event-end` | ISO 8601 | Да | Дата и время окончания | `"2025-06-05T18:00:00"` |
| `data-event-timezone` | string | Нет | Часовой пояс (IANA) | `"Asia/Baku"` (default: "UTC") |

### Параметры миксина

```pug
+add-to-calendar(title, description, location, startDate, endDate, timezone, displayText)
```

1. **title** (string) - Название события
2. **description** (string) - Описание события
3. **location** (string) - Местоположение
4. **startDate** (ISO 8601) - Дата начала
5. **endDate** (ISO 8601) - Дата окончания
6. **timezone** (IANA timezone) - Часовой пояс
7. **displayText** (string) - Текст кнопки для отображения

## Поддерживаемые календари

- **Google Calendar** - открывает форму создания события
- **Apple Calendar (iCal)** - скачивает .ics файл
- **Outlook Calendar** - открывает Outlook desktop
- **Outlook.com** - открывает веб-версию Outlook
- **Yahoo Calendar** - открывает Yahoo Calendar

## Формат даты

Используйте формат **ISO 8601** для дат:
- `YYYY-MM-DDTHH:mm:ss` (локальное время)
- `YYYY-MM-DDTHH:mm:ssZ` (UTC)

Примеры:
- `2025-06-03T09:00:00` - 3 июня 2025, 09:00 (локальное время)
- `2025-06-05T18:00:00Z` - 5 июня 2025, 18:00 UTC

## Часовые пояса

Используйте стандарт **IANA timezone**:
- `Asia/Baku` - Баку, Азербайджан
- `Europe/Moscow` - Москва
- `America/New_York` - Нью-Йорк
- `Europe/London` - Лондон
- `Asia/Tokyo` - Токио

[Полный список часовых поясов](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Примеры использования

### Пример 1: Конференция

```pug
+add-to-calendar(
  'Tech Conference 2025',
  'Annual technology conference with industry leaders',
  'Convention Center, Baku',
  '2025-09-15T10:00:00',
  '2025-09-15T18:00:00',
  'Asia/Baku',
  '15 September, 2025'
)
```

### Пример 2: Многодневное мероприятие

```pug
+add-to-calendar(
  'ADEX 2025',
  'Azerbaijan International Construction Exhibition',
  'Baku Expo Center',
  '2025-06-03T09:00:00',
  '2025-06-05T18:00:00',
  'Asia/Baku',
  '3-5 June, 2025'
)
```

### Пример 3: Вебинар

```pug
+add-to-calendar(
  'Online Webinar',
  'Learn about new technologies',
  'Online',
  '2025-07-20T14:00:00',
  '2025-07-20T15:30:00',
  'UTC',
  '20 July, 14:00 UTC'
)
```

## Стилизация

Компонент использует следующие CSS классы:
- `.topbar__calendar` - контейнер
- `.topbar__calendar-btn` - кнопка
- `.topbar__calendar-dropdown` - выпадающее меню

Стили находятся в: `src/scss/components/_topbar.scss`

## JavaScript API

Компонент автоматически инициализируется при загрузке страницы.

Для ручной инициализации:

```javascript
import { initAddToCalendar } from './modules/add-to-calendar';

initAddToCalendar();
```

## Файлы компонента

- **Pug миксин**: `src/pug/mixins/_add-to-calendar.pug`
- **JavaScript**: `src/js/modules/add-to-calendar.js`
- **Стили**: `src/scss/components/_topbar.scss`
- **Использование**: `src/pug/components/_topbar.pug`

## Требования

- Bootstrap 5 (для dropdown)
- Font Awesome (для иконок)

## Совместимость

- Google Calendar ✓
- Apple Calendar (macOS, iOS) ✓
- Outlook Desktop ✓
- Outlook.com ✓
- Yahoo Calendar ✓
- Другие iCal-совместимые календари ✓
