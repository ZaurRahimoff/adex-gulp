# DataTable Component - Документация

## Описание
Универсальный компонент для создания таблиц с пагинацией на основе библиотеки DataTables.

## Особенности
- ✅ Компонентный подход (миксин Pug)
- ✅ Настройка через атрибуты (без изменения JS)
- ✅ Два режима отображения: `grid` и `table`
- ✅ Адаптивность
- ✅ Автоматическая пагинация
- ✅ BEM методология
- ✅ Переиспользование стилей

## Использование

### Базовый пример

```pug
include ../mixins/_datatable

-
  const myData = ['Item 1', 'Item 2', 'Item 3', ...]
  const myOptions = {
    title: 'My Table',
    blockClass: 'my-table',
    pageLength: 10
  }

+datatable('myTableId', myData, myOptions)
```

### Параметры миксина

#### 1. tableId (string, обязательный)
Уникальный ID для таблицы.

```pug
+datatable('companyTable', data, options)
```

#### 2. data (array, обязательный)
Массив данных для отображения. Может быть массивом:
- **Строк**: `['Item 1', 'Item 2', 'Item 3']`
- **Объектов**: `[{name: 'Company 1'}, {name: 'Company 2'}]`

```pug
-
  const companies = [
    'ACWA Power',
    'ABB',
    'BP'
  ]

+datatable('table1', companies, options)
```

или

```pug
-
  const companies = [
    {name: 'ACWA Power', country: 'UAE'},
    {name: 'ABB', country: 'Switzerland'}
  ]

+datatable('table2', companies, options)
```

#### 3. options (object, опциональный)
Объект с настройками компонента.

##### Доступные опции:

| Опция | Тип | По умолчанию | Описание |
|-------|-----|--------------|----------|
| `title` | string | 'DataTable' | Заголовок таблицы |
| `blockClass` | string | 'datatable' | Базовый BEM класс |
| `renderType` | string | 'grid' | Тип отображения: 'grid' или 'table' |
| `pageLength` | number | 10 | Количество элементов на странице |
| `gridColumns` | number | 2 | Количество колонок в grid режиме |
| `cardClass` | string | 'datatable__card' | Класс для карточек |
| `cardAltClass` | string | 'datatable__card--alt' | Класс для альтернативных карточек |
| `searching` | boolean | false | Включить поиск |
| `info` | boolean | false | Показывать информацию |
| `lengthChange` | boolean | false | Показывать выбор количества |
| `responsive` | boolean | false | Адаптивный режим |
| `paging` | boolean | true | Включить пагинацию |

### Примеры использования

#### Пример 1: Простой список (grid)

```pug
-
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
  const options = {
    title: 'My Items',
    blockClass: 'items',
    pageLength: 3
  }

+datatable('itemsTable', items, options)
```

#### Пример 2: Список компаний (Company страница)

```pug
-
  const companies = [
    'ACWA Power',
    'ABB',
    'BP',
    // ... до 100 компаний
  ]
  
  const options = {
    title: 'Company',
    blockClass: 'company',
    renderType: 'grid',
    pageLength: 18,
    gridColumns: 2
  }

+datatable('companyTable', companies, options)
```

#### Пример 3: Таблица с большим количеством элементов

```pug
-
  const products = []
  for (let i = 1; i <= 100; i++) {
    products.push('Product ' + i)
  }
  
  const options = {
    title: 'Products',
    blockClass: 'products',
    pageLength: 20,
    gridColumns: 3
  }

+datatable('productsTable', products, options)
```

#### Пример 4: Без заголовка

```pug
-
  const items = ['Item 1', 'Item 2', 'Item 3']
  const options = {
    title: null, // Без заголовка
    blockClass: 'items',
    pageLength: 10
  }

+datatable('itemsTable', items, options)
```

## Стилизация

### Кастомизация для вашей страницы

Создайте стили для вашего блока в `src/scss/pages/_your-page.scss`:

```scss
.your-block {
  // Head секция
  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  // Wrapper для DataTable
  &__wrapper {
    width: 100%;
  }

  // Content (серый контейнер)
  &__content {
    background-color: var(--card-1);
    border-radius: 12px;
    padding: 40px;
  }

  // Header (синий блок)
  &__header {
    background-color: var(--primary);
    border-radius: 12px;
    padding: 30px 40px;
    margin-bottom: 30px;
  }

  // Title
  &__title {
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 24px;
    color: var(--white);
    margin: 0;
  }

  // Grid
  &__grid {
    margin-bottom: 30px;
  }

  // Card (карточка)
  &__card {
    background-color: var(--white);
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
    
    // Альтернативный фон
    &--alt {
      background-color: var(--card-2);
    }
  }

  // Pagination wrapper
  &__pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .dataTables_paginate {
      display: flex;
      width: 100%;
      
      .paginate_button {
        // Стили кнопок пагинации
      }
    }
  }
}
```

### Переопределение глобальных стилей

Если нужно изменить базовые стили DataTable, редактируйте `src/scss/components/_datatable.scss`.

## JavaScript API

JavaScript модуль автоматически инициализирует все таблицы с атрибутом `data-datatables-init="true"`.

### Кастомная инициализация

Если нужна ручная инициализация, можно вызвать:

```javascript
import { initDataTable } from './modules/datatables';

const tableElement = document.querySelector('#myTable');
initDataTable(tableElement);
```

### Data-атрибуты

Помимо миксина, можно настраивать DataTable через data-атрибуты в HTML:

```html
<table 
  data-datatables-init="true"
  data-page-length="20"
  data-render-type="grid"
  data-block-class="my-custom-class"
  data-grid-container="[data-grid-container]"
  data-responsive="true"
>
  <!-- ... -->
</table>
```

## Структура HTML

### Grid режим

```html
<div class="company__wrapper">
  <div class="company__content">
    <div class="company__header">
      <h2 class="company__title">Company</h2>
    </div>
    
    <!-- Grid контейнер -->
    <div class="company__grid row row-cols-1 row-cols-md-2 g-3" data-grid-container>
      <!-- Карточки генерируются динамически через JS -->
      <div class="col">
        <div class="company__card company__card--alt">ACWA Power</div>
      </div>
      <div class="col">
        <div class="company__card company__card--alt">ABB</div>
      </div>
      <!-- ... -->
    </div>
    
    <!-- Пагинация -->
    <div class="company__pagination-wrapper">
      <div class="dataTables_paginate">
        <ul class="pagination">
          <li><a class="paginate_button previous"><i class="fas fa-arrow-left"></i> After</a></li>
          <li><a class="paginate_button current">1</a></li>
          <li><a class="paginate_button">2</a></li>
          <li><a class="paginate_button next">Before <i class="fas fa-arrow-right"></i></a></li>
        </ul>
      </div>
    </div>
    
    <!-- Скрытая таблица для DataTables -->
    <table class="d-none" id="companyTable" data-datatables-init="true">
      <!-- ... -->
    </table>
  </div>
</div>
```

## FAQ

### Как изменить количество элементов на странице?

```pug
-
  const options = {
    pageLength: 20 // Изменить с 10 на 20
  }
```

### Как убрать пагинацию?

```pug
-
  const options = {
    paging: false
  }
```

### Как сделать 3 колонки вместо 2?

```pug
-
  const options = {
    gridColumns: 3
  }
```

### Как добавить поиск?

```pug
-
  const options = {
    searching: true
  }
```

### Как изменить текст кнопок пагинации?

Редактируйте в `src/js/modules/datatables.js`:

```javascript
language: {
  paginate: {
    previous: '← Назад',
    next: 'Вперед →',
  },
}
```

### Как чередовать цвета карточек?

Логика чередования встроена в JS модуль. Нечетные ряды получают класс `--alt`:

```javascript
// В drawCallback
const rowNumber = Math.floor(rowIndex / 2);
if (rowNumber % 2 === 0) {
  $card.addClass(`${config.gridCardClass}--alt`);
}
```

## Зависимости

- jQuery (уже включен в проект)
- DataTables (находится в `src/plugins/datatables/`)
- Bootstrap 5 grid (для layout)
- Font Awesome (для иконок в пагинации)

## Файлы компонента

```
src/
├── pug/
│   └── mixins/
│       └── _datatable.pug          # Pug миксин
├── scss/
│   └── components/
│       └── _datatable.scss         # Базовые стили
└── js/
    └── modules/
        └── datatables.js           # JavaScript логика
```

## Пример страницы Company

Полный пример реализации см. в файлах:
- `src/pug/pages/company.pug`
- `src/scss/pages/_company.scss`
