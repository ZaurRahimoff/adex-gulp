# DataTables Responsive Extension - Установка

## ✅ Статус: Установлено и работает

### Версии
- **DataTables:** 1.13.7
- **Responsive:** 2.5.0 (совместимая версия)

---

## 📦 Установленные файлы

### JavaScript
```
src/plugins/datatables/dataTables.responsive.min.js
```

### CSS
```
src/plugins/datatables/responsive.bootstrap5.min.css
```

---

## 🔌 Подключение в проекте

### 1. CSS (в `_head-assets.pug`)

```pug
// DataTables Bootstrap 5 CSS
link(rel="stylesheet" href="assets/plugins/datatables/dataTables.bootstrap5.min.css")

// DataTables Responsive CSS
link(rel="stylesheet" href="assets/plugins/datatables/responsive.bootstrap5.min.css")
```

### 2. JavaScript (в `_js-assets.pug`)

```pug
// DataTables JS
script(src="assets/plugins/datatables/jquery.dataTables.min.js")
script(src="assets/plugins/datatables/dataTables.bootstrap5.min.js")

// DataTables Responsive JS
script(src="assets/plugins/datatables/dataTables.responsive.min.js")
```

---

## 🎯 Использование

### В Pug файле

```pug
+datatable(
  'exhibitorsTable',
  columns,
  data,
  {
    blockClass: 'exhibitors',
    renderType: 'table',
    responsive: true,      // ✅ Включить адаптивность
    pageLength: 10
  }
)
```

### Результат на мобильных устройствах

На маленьких экранах:
1. Автоматически скрываются колонки, которые не помещаются
2. Добавляется кнопка **►** для раскрытия данных
3. При клике показываются все скрытые данные строки

---

## 🔄 Обновление версий

### Если нужна новая версия Responsive:

1. **Для DataTables 1.x** (текущая версия):
   ```bash
   cd src/plugins/datatables
   curl -o dataTables.responsive.min.js https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js
   curl -o responsive.bootstrap5.min.css https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css
   ```

2. **Для DataTables 2.x** (требует обновления DataTables):
   ```bash
   cd src/plugins/datatables
   curl -o dataTables.responsive.min.js https://cdn.datatables.net/responsive/3.0.4/js/dataTables.responsive.min.js
   curl -o responsive.bootstrap5.min.css https://cdn.datatables.net/responsive/3.0.4/css/responsive.bootstrap5.min.css
   ```

3. Пересобрать проект:
   ```bash
   npm run build
   ```

---

## ⚠️ Важно: Совместимость версий

| DataTables | Responsive | Статус |
|------------|------------|---------|
| 1.13.x     | 2.5.0      | ✅ Работает |
| 2.x        | 3.0.x      | ⚠️ Требует обновления DataTables |

**Текущая установка:** DataTables 1.13.7 + Responsive 2.5.0

---

## 📚 Документация

- [DataTables Responsive](https://datatables.net/extensions/responsive/)
- [Responsive API](https://datatables.net/reference/api/responsive)
- [Responsive Examples](https://datatables.net/extensions/responsive/examples/)

---

## ✅ Проверка работы

Откройте `http://localhost:3000/exhibitors.html` и уменьшите окно браузера до 400px.  
Вы должны увидеть:
- Только одна колонка **Company**
- Кнопка **►** рядом с каждой строкой
- При клике раскрываются скрытые данные
