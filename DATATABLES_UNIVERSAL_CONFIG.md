# DataTables Универсальная Конфигурация

## 🎯 Основная идея

**Теперь вы можете использовать ЛЮБЫЕ настройки DataTables через атрибуты в Pug!**

Система автоматически разделяет настройки на:
- **Кастомные** (специфичные для компонента) - не передаются в DataTables
- **Стандартные** (из официальной документации DataTables) - автоматически передаются

---

## ✅ Что работает

### 📊 Exhibitors (Table режим)

**Настройки:**
```javascript
{
  pageLength: 10,        ✅ Работает
  searching: false,      ✅ Работает
  info: false,           ✅ Работает
  lengthChange: false,   ✅ Работает
  paging: true,          ✅ Работает
  autoWidth: false,      ✅ Работает
  order: false,          ✅ Работает (отключена сортировка)
  columnDefs: [...]      ✅ Работает (ширина колонок)
}
```

**Результат в DataTables:**
- Все настройки **корректно передаются**
- Кастомные настройки **не попадают в oInit**
- Таблица отображается с правильными заголовками
- Пагинация работает идеально

---

### 📊 Company (Grid режим)

**Настройки:**
```javascript
{
  pageLength: 18,        ✅ Работает (18 карточек на странице)
  searching: false,      ✅ Работает
  info: false,           ✅ Работает
  lengthChange: false,   ✅ Работает
  paging: true,          ✅ Работает
}
```

**Результат в DataTables:**
- Карточки рендерятся в 2 колонки
- Пагинация работает корректно
- 18 карточек на странице

---

## 🔧 Как использовать ЛЮБЫЕ настройки

### Пример 1: ScrollX/ScrollY

```pug
+datatable(
  'scrollTable',
  columns,
  data,
  {
    blockClass: 'my-table',
    renderType: 'table',
    scrollX: true,        // Горизонтальный скролл
    scrollY: '500px',     // Вертикальный скролл
    paging: false         // Без пагинации
  }
)
```

### Пример 2: FixedHeader

```pug
+datatable(
  'fixedTable',
  columns,
  data,
  {
    blockClass: 'fixed-table',
    renderType: 'table',
    fixedHeader: true,    // Фиксированный header
    pageLength: 50
  }
)
```

### Пример 3: ServerSide

```pug
+datatable(
  'serverTable',
  columns,
  data,
  {
    blockClass: 'server-table',
    renderType: 'table',
    serverSide: true,     // Серверная обработка
    ajax: '/api/data',    // API endpoint
    processing: true,     // Показывать "Processing..."
    searching: true,
    pageLength: 100
  }
)
```

### Пример 4: Language

```pug
+datatable(
  'russianTable',
  columns,
  data,
  {
    blockClass: 'russian-table',
    renderType: 'table',
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/ru.json'
    },
    pageLength: 20
  }
)
```

---

## 📝 Список кастомных настроек

Эти настройки **НЕ передаются** в DataTables (используются только компонентом):

| Настройка | Тип | Описание |
|-----------|-----|----------|
| `renderType` | string | Тип рендеринга: `'grid'` или `'table'` |
| `blockClass` | string | Базовый BEM класс блока |
| `gridContainer` | string | Селектор контейнера для grid |
| `gridCardClass` | string | Класс карточки для grid |
| `title` | string | Заголовок блока |
| `showHeader` | boolean | Показывать ли header |
| `cardClass` | string | Класс для карточек |
| `cardAltClass` | string | Класс для альтернативных карточек |
| `gridColumns` | number | Количество колонок в grid |

**ВСЕ ОСТАЛЬНЫЕ** настройки автоматически передаются в DataTables!

---

## 📚 Полный список стандартных настроек DataTables

Все настройки из [официальной документации](https://datatables.net/reference/option/) доступны:

### Основные
- `pageLength`, `lengthMenu`, `lengthChange`
- `paging`, `pagingType`
- `searching`, `search`
- `ordering`, `order`, `orderMulti`
- `info`, `infoCallback`
- `autoWidth`, `deferRender`
- `processing`, `serverSide`
- `ajax`, `data`
- `columns`, `columnDefs`
- `dom`, `language`
- `responsive` (требует Responsive extension)

### Расширения (если подключены)
- `fixedHeader`, `fixedColumns`
- `select`, `rowReorder`, `colReorder`
- `scroller`, `scrollX`, `scrollY`, `scrollCollapse`
- `buttons`, `searchPanes`, `searchBuilder`

---

## ✅ Responsive Extension - ПОДКЛЮЧЁН!

**Responsive extension успешно установлен и работает!**

### Установленная версия:
- **DataTables:** 1.13.7
- **Responsive:** 2.5.0 (совместимая версия для DataTables 1.x)

### Файлы:
```
src/plugins/datatables/
  ├── dataTables.responsive.min.js
  └── responsive.bootstrap5.min.css
```

### Использование:

Просто добавьте `responsive: true` в настройки:

```pug
+datatable(
  'myTable',
  columns,
  data,
  {
    blockClass: 'my-table',
    renderType: 'table',
    responsive: true,    // ✅ Работает!
    pageLength: 10
  }
)
```

### Как работает:

На маленьких экранах (мобильные устройства):
- Автоматически скрывает колонки, которые не помещаются
- Добавляет кнопку **►** для раскрытия скрытых данных
- При клике показывает все данные строки

### Документация:
- [DataTables Responsive](https://datatables.net/extensions/responsive/)
- [Responsive Init](https://datatables.net/extensions/responsive/init)

---

## 🧪 Проверка настроек в консоли

Чтобы проверить, какие настройки передались в DataTables:

```javascript
// В консоли браузера
const dt = jQuery('[data-datatables-init="true"]').DataTable();
const settings = dt.settings()[0];

// Все переданные настройки
console.log(settings.oInit);

// Проверка конкретной настройки
console.log(settings.oInit.pageLength);     // 10
console.log(settings.oInit.responsive);     // false
console.log(settings.oInit.columnDefs);     // [...]

// Кастомные настройки НЕ должны быть в oInit
console.log(settings.oInit.blockClass);     // undefined ✅
console.log(settings.oInit.renderType);     // undefined ✅
```

---

## 📖 Документация

- [DataTables Options](https://datatables.net/reference/option/)
- [DataTables Extensions](https://datatables.net/extensions/)
- [DataTables Examples](https://datatables.net/examples/)
- [Responsive Init](https://datatables.net/extensions/responsive/init)

---

## ✅ Итог

Система **полностью универсальна**:
- ✅ Любые настройки из Pug передаются в DataTables
- ✅ Кастомные настройки компонента отфильтровываются
- ✅ Не нужно менять JavaScript для новых настроек
- ✅ Полная совместимость с официальной документацией DataTables

**Теперь вы можете использовать DataTables на полную мощность!** 🚀
