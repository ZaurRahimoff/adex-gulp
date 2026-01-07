/**
 * DataTables Module - универсальная инициализация DataTables
 * Автоматически инициализирует все таблицы с классом .company-datatable и атрибутом data-datatable-init="true"
 * 
 * Использование в HTML:
 * <table class="company-datatable" data-datatable-init="true">
 *   <thead>...</thead>
 *   <tbody>...</tbody>
 * </table>
 */

// Дефолтная конфигурация для таблицы компаний
const defaultConfig = {
  language: {
    search: '',
    lengthMenu: '',
    info: '',
    infoEmpty: '',
    infoFiltered: '',
    paginate: {
      first: '← After',
      last: 'Before →',
      next: 'Before →',
      previous: '← After'
    },
    emptyTable: '',
    zeroRecords: ''
  },
  pageLength: 18, // Показывать 18 компаний на странице (9 строк в две колонки)
  lengthMenu: [[18, 36, 54, -1], [18, 36, 54, 'Все']],
  order: [], // Без сортировки по умолчанию
  searching: false, // Отключаем поиск
  paging: true,
  info: false, // Скрываем информацию
  autoWidth: false,
  responsive: false,
  dom: 'rtp', // Только таблица и пагинация (без поиска, длины, информации)
  drawCallback: function() {
    // Синхронизация визуальной сетки с DataTables
    syncCompanyGrid(this);
  }
};

/**
 * Синхронизация визуальной сетки компаний с DataTables
 */
function syncCompanyGrid(dataTable) {
  if (typeof jQuery === 'undefined') {
    return;
  }

  const $table = jQuery(dataTable.table().node());
  const $container = $table.closest('.company-page__container');
  const $grid = $container.find('#companyGrid');
  // Пагинация теперь находится под контейнером на том же уровне
  let $pagination = $container.siblings('#companyPagination');
  
  // Если не найдена как sibling, ищем в родительском элементе (col-12)
  if (!$pagination.length) {
    $pagination = $container.closest('.col-12').find('#companyPagination');
  }

  if (!$grid.length || !$pagination.length) {
    return;
  }

  // Получаем данные текущей страницы
  const pageInfo = dataTable.page.info();
  const currentPage = pageInfo.page;
  const pageLength = pageInfo.length;
  const start = pageInfo.start;
  const end = pageInfo.end;
  const total = pageInfo.recordsTotal;

  // Получаем все компании из таблицы
  const allCompanies = [];
  dataTable.rows({ search: 'applied' }).every(function() {
    const data = this.data();
    allCompanies.push(data[0]); // Берем первую колонку
  });

  // Получаем компании для текущей страницы
  const pageCompanies = allCompanies.slice(start, end);

  // Заполняем сетку компаниями текущей страницы в две колонки
  let html = '';
  pageCompanies.forEach((company) => {
    html += '<div class="col-12 col-md-6">';
    html += `<div class="company-page__item">${company}</div>`;
    html += '</div>';
  });
  
  // Обновляем содержимое сетки
  const $row = $grid.find('.row');
  if ($row.length) {
    $row.html(html);
  } else {
    $grid.html(`<div class="row g-3">${html}</div>`);
  }

  // Создаем кастомную пагинацию
  createCustomPagination($pagination, pageInfo, dataTable);
}

/**
 * Создание кастомной пагинации
 */
function createCustomPagination($pagination, pageInfo, dataTable) {
  const currentPage = pageInfo.page;
  const totalPages = pageInfo.pages;
  const total = pageInfo.recordsTotal;

  if (totalPages <= 1) {
    $pagination.empty();
    return;
  }

  let html = '<nav aria-label="Company pagination"><ul class="pagination justify-content-center mb-0">';

  // Кнопка "← After" (Previous)
  const prevDisabled = currentPage === 0 ? 'disabled' : '';
  html += `<li class="page-item ${prevDisabled}">`;
  html += `<a class="page-link" href="#" data-page="prev" aria-label="Previous">`;
  html += '<span aria-hidden="true">← After</span>';
  html += '</a></li>';

  // Номера страниц
  const maxVisible = 7;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  // Первая страница
  if (startPage > 0) {
    html += `<li class="page-item"><a class="page-link" href="#" data-page="0">1</a></li>`;
    if (startPage > 1) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Страницы
  for (let i = startPage; i <= endPage; i++) {
    const active = i === currentPage ? 'active' : '';
    html += `<li class="page-item ${active}">`;
    html += `<a class="page-link" href="#" data-page="${i}">${i + 1}</a>`;
    html += '</li>';
  }

  // Последняя страница
  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages - 1}">${totalPages}</a></li>`;
  }

  // Кнопка "Before →" (Next)
  const nextDisabled = currentPage >= totalPages - 1 ? 'disabled' : '';
  html += `<li class="page-item ${nextDisabled}">`;
  html += `<a class="page-link" href="#" data-page="next" aria-label="Next">`;
  html += '<span aria-hidden="true">Before →</span>';
  html += '</a></li>';

  html += '</ul></nav>';

  $pagination.html(html);

  // Обработчики кликов
  $pagination.find('a[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = jQuery(this).attr('data-page');

    if (page === 'prev') {
      dataTable.page('previous').draw('page');
    } else if (page === 'next') {
      dataTable.page('next').draw('page');
    } else {
      dataTable.page(parseInt(page)).draw('page');
    }
  });
}

/**
 * Инициализация DataTables для элемента
 * @param {jQuery} $table - jQuery элемент table
 */
function initDataTable($table) {
  // Проверка наличия jQuery и DataTables
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
    console.warn('DataTables: jQuery или DataTables не загружены');
    return null;
  }

  // Проверяем, не инициализирована ли уже таблица
  if ($table.hasClass('dataTable')) {
    return $table.DataTable();
  }

  // Получаем конфигурацию из data-атрибута или используем дефолтную
  let config = { ...defaultConfig };
  
  const configAttr = $table.attr('data-datatable-config');
  if (configAttr) {
    try {
      const customConfig = JSON.parse(configAttr);
      config = { ...config, ...customConfig };
    } catch (e) {
      console.warn('DataTables: Ошибка парсинга конфигурации', e);
    }
  }

  // Инициализация DataTables
  const dataTable = $table.DataTable(config);

  // Применение кастомных классов
  const $wrapper = $table.closest('.company-page__container');
  if ($wrapper.length) {
    $wrapper.addClass('company-page__container--datatable');
    
    // Скрываем стандартные элементы управления DataTables
    $wrapper.find('.dataTables_length, .dataTables_filter, .dataTables_info').hide();
    
    // Первоначальная синхронизация сетки
    syncCompanyGrid(dataTable);
  }

  return dataTable;
}

/**
 * Инициализация всех DataTables элементов на странице
 */
function initAllDataTables() {
  // Проверка наличия jQuery и DataTables
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
    console.warn('DataTables: jQuery или DataTables не загружены');
    return;
  }

  const $tables = jQuery('table[data-datatable-init="true"]');
  
  $tables.each(function() {
    const $table = jQuery(this);
    initDataTable($table);
  });
}

/**
 * Публичный API для ручной инициализации
 */
export const DataTablesInit = {
  /**
   * Инициализировать конкретную таблицу
   * @param {string|jQuery} selector - селектор или jQuery элемент
   * @param {object} customConfig - кастомная конфигурация
   */
  init: function(selector, customConfig = {}) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
      console.warn('DataTables: jQuery или DataTables не загружены');
      return null;
    }

    const $table = typeof selector === 'string' ? jQuery(selector) : selector;
    
    if ($table.length && $table.is('table')) {
      const config = { ...defaultConfig, ...customConfig };
      return $table.DataTable(config);
    }
    
    return null;
  },

  /**
   * Уничтожить DataTables для таблицы
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  destroy: function(selector) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
      console.warn('DataTables: jQuery или DataTables не загружены');
      return;
    }

    const $table = typeof selector === 'string' ? jQuery(selector) : selector;
    
    if ($table.length && $table.hasClass('dataTable')) {
      $table.DataTable().destroy();
    }
  },

  /**
   * Переинициализировать все DataTables на странице
   */
  reinit: function() {
    initAllDataTables();
  }
};

/**
 * Инициализация DataTables модуля
 * Вызывается автоматически при загрузке DOM
 */
export function initDataTablesModule() {
  // Функция для попытки инициализации
  function tryInit() {
    // Проверка наличия jQuery и DataTables
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
      return false;
    }

    // Инициализация всех DataTables элементов
    initAllDataTables();
    
    return true;
  }

  // Пытаемся инициализировать сразу
  if (tryInit()) {
    return;
  }

  // Если не получилось, ждем загрузки скриптов
  if (document.readyState === 'loading') {
    window.addEventListener('load', function() {
      if (!tryInit()) {
        // Если все еще не загружено, пытаемся через интервал
        const checkInterval = setInterval(() => {
          if (tryInit()) {
            clearInterval(checkInterval);
          }
        }, 100);
        
        // Останавливаем проверку через 10 секунд
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    });
  } else {
    // DOM уже загружен, но скрипты могут еще загружаться
    const checkInterval = setInterval(() => {
      if (tryInit()) {
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Останавливаем проверку через 10 секунд
    setTimeout(() => clearInterval(checkInterval), 10000);
  }
}

// Экспортируем для глобального доступа (если нужно)
if (typeof window !== 'undefined') {
  window.DataTablesInit = DataTablesInit;
}
