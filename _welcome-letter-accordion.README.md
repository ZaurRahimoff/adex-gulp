# Welcome Letter Accordion Mixin

Переиспользуемый компонент для создания аккордиона писем приветствия на Bootstrap 5.

## Особенность

При закрытом состоянии аккордиона видна **часть контента** (заголовок и начало текста), что реализовано через CSS с использованием `max-height` вместо `display: none`.

## Использование

```pug
include ../mixins/_welcome-letter-accordion

+welcome-letter-accordion(
  '1',                                    // id (обязательно)
  'Ilham Aliyev',                         // имя (обязательно)
  'President of the Republic of Azerbaijan', // должность (обязательно)
  'assets/img/welcome/ilham-aliyev.jpg',  // фото (обязательно)
  'Dear Exhibitors and Guests,',          // приветствие (обязательно)
  'I extend my greetings...',             // текст письма (обязательно)
  true                                    // открыт по умолчанию (опционально, false по умолчанию)
)
```

## Параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `id` | String | Да | Уникальный идентификатор аккордиона |
| `name` | String | Да | Имя автора письма |
| `position` | String | Да | Должность автора |
| `photo` | String | Да | Путь к фотографии (150x150px или больше) |
| `greeting` | String | Да | Заголовок письма/приветствие |
| `text` | String | Да | Полный текст письма |
| `isExpanded` | Boolean | Нет | Открыт ли аккордион по умолчанию (false) |

## Стилизация

Стили находятся в `src/scss/pages/_welcome-letters.scss`:

- **Карточка**: `.welcome-letter__card` - фон #F8F9FA, padding 40px, border-radius 12px
- **Заголовок**: `.welcome-letter__header` - фон #E9ECEF, padding 20px
- **Аватар**: `.welcome-letter__avatar` - 150x150px круглое фото
- **Кнопка toggle**: `.welcome-letter__toggle` - белая круглая кнопка 35x35px
- **Контент**: `.welcome-letter__content` - отображается частично при закрытом состоянии

## Техническая реализация частичного отображения

При закрытом аккордионе:
- `max-height: 180px` (desktop) / `140px` (mobile)
- `overflow: hidden`
- Градиент снизу для плавного обрезания текста
- Плавная анимация через `transition`

При открытом аккордионе:
- `max-height: none`
- Градиент скрыт

## Bootstrap 5 Integration

Миксин использует стандартную структуру Bootstrap 5 Accordion:
- `.accordion-item`
- `.accordion-header`
- `.accordion-button`
- `.accordion-collapse`
- `.accordion-body`

Кастомизация Bootstrap через переопределение CSS переменных в SCSS.
