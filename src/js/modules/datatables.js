/**
 * DataTables Module - универсальная инициализация DataTables
 * Поддерживает настройку через data-атрибуты
 * 
 * Использование:
 * <table data-datatables-init="true" data-datatables-config='{"renderType":"grid","pageLength":10}'>
 * 
 * Data-атрибуты:
 * - data-datatables-init="true" - включить инициализацию
 * - data-datatables-config='{"renderType":"grid","pageLength":10}' - конфигурация JSON
 */

/**
 * Парсинг конфигурации из data-атрибутов
 * @param {jQuery} $table - jQuery объект таблицы
 * @returns {Object} Конфигурация DataTables
 */
function parseDataTableConfig($table) {
  const defaultConfig = {
    pageLength: 10,
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    searching: false,
    info: false,
    lengthChange: false,
    paging: true,
    order: [],
    autoWidth: false,
    renderType: 'table', // 'grid' или 'table'
    gridContainer: '[data-grid-container]', // селектор контейнера для grid
    gridCardClass: 'datatable--grid__card', // класс карточки для grid
    blockClass: 'datatable', // базовый класс блока
    language: {
      paginate: {
        previous: 'After',
        next: 'Before'
      }
    },
    dom: 'rt<"datatable__pagination-wrapper"p>'
  };

  // Парсим конфигурацию из data-атрибута
  const configAttr = $table.attr('data-datatables-config');
  if (configAttr) {
    try {
      const customConfig = JSON.parse(configAttr.replace(/&quot;/g, '"'));
      return { ...defaultConfig, ...customConfig };
    } catch (e) {
      console.warn('DataTables: Ошибка парсинга конфигурации', e);
    }
  }

  // Парсим отдельные data-атрибуты
  const config = { ...defaultConfig };
  
  if ($table.attr('data-page-length')) {
    config.pageLength = parseInt($table.attr('data-page-length'), 10);
  }
  
  if ($table.attr('data-render-type')) {
    config.renderType = $table.attr('data-render-type');
  }
  
  if ($table.attr('data-grid-container')) {
    config.gridContainer = $table.attr('data-grid-container');
  }
  
  if ($table.attr('data-grid-card-class')) {
    config.gridCardClass = $table.attr('data-grid-card-class');
  }
  
  if ($table.attr('data-block-class')) {
    config.blockClass = $table.attr('data-block-class');
  }

  return config;
}

/**
 * Инициализация DataTables для элемента
 * @param {HTMLElement} tableElement - HTML элемент table
 */
function initDataTable(tableElement) {
  // Проверка наличия jQuery и DataTables
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
    console.warn('DataTables: jQuery или DataTables не загружены');
    return;
  }

  const $table = jQuery(tableElement);

  // Проверяем, не инициализирована ли уже таблица
  if ($table.hasClass('dataTable')) {
    return;
  }

  // Получаем конфигурацию
  const config = parseDataTableConfig($table);
  const $wrapper = $table.closest(`.${config.blockClass}__wrapper`);

  // Настройка drawCallback в зависимости от типа рендеринга
  if (config.renderType === 'grid') {
    config.drawCallback = function(settings) {
      const api = this.api();
      const pageInfo = api.page.info();
      
      // Находим контейнер для grid
      const $grid = $wrapper.find(config.gridContainer);
      if ($grid.length === 0) return;
      
      // Очищаем grid
      $grid.empty();
      
      // Получаем видимые строки текущей страницы
      const visibleRows = api.rows({ page: 'current' }).nodes();
      
      // Создаем карточки для видимых строк
      jQuery(visibleRows).each(function(rowIndex) {
        const $row = jQuery(this);
        const $firstCell = $row.find('td').first();
        const cellText = $firstCell.text();
        
        // Определяем номер строки в сетке (каждая строка содержит 2 карточки)
        const globalRowIndex = pageInfo.start + rowIndex;
        const gridRowNumber = Math.floor(globalRowIndex / 2);
        // Нечетные строки сетки (0, 2, 4...) -> серые, четные (1, 3, 5...) -> белые
        const isOddGridRow = gridRowNumber % 2 === 0;
        const bgColor = isOddGridRow ? 'var(--card-2)' : 'var(--white)';
        
        const $col = jQuery('<div>').addClass('col');
        const $card = jQuery('<div>')
          .addClass(config.gridCardClass)
          .css('background-color', bgColor)
          .text(cellText);
        
        $col.append($card);
        $grid.append($col);
      });
    };
  } else if (config.renderType === 'table') {
    // Для table типа настраиваем отображение строк как grid
    config.drawCallback = function(settings) {
      const api = this.api();
      const visibleRows = api.rows({ page: 'current' }).nodes();
      
      // Применяем стили к строкам таблицы
      jQuery(visibleRows).each(function() {
        const $row = jQuery(this);
        $row.addClass(`${config.blockClass}--table__row`);
        $row.find('td').each(function() {
          const $cell = jQuery(this);
          $cell.addClass(`${config.blockClass}--table__cell`);
        });
      });
    };
  }

  // Инициализация DataTables
  const dataTable = $table.DataTable(config);
  
  // Настройка пагинации
  const $dataTablesWrapper = $table.closest('.dataTables_wrapper');
  const $paginationContainer = $dataTablesWrapper.find(`.${config.blockClass}__pagination-wrapper`);
  
  if ($paginationContainer.length) {
    // Перемещаем контейнер пагинации в конец wrapper'а
    $paginationContainer.detach();
    $wrapper.append($paginationContainer);
  }
  
  // Функция для добавления иконок Font Awesome в кнопки пагинации
  function addPaginationIcons() {
    const $previousBtn = $paginationContainer.find('.paginate_button.previous');
    const $nextBtn = $paginationContainer.find('.paginate_button.next');
    
    // Добавляем иконку в кнопку "After" (Previous)
    if ($previousBtn.length && !$previousBtn.find('i').length) {
      const $icon = jQuery('<i>').addClass('fas fa-arrow-left');
      $previousBtn.prepend($icon);
    }
    
    // Добавляем иконку в кнопку "Before" (Next)
    if ($nextBtn.length && !$nextBtn.find('i').length) {
      const $icon = jQuery('<i>').addClass('fas fa-arrow-right');
      $nextBtn.append($icon);
    }
  }
  
  // Добавляем иконки после инициализации
  addPaginationIcons();
  
  // Добавляем иконки при каждом обновлении пагинации
  dataTable.on('draw', function() {
    setTimeout(addPaginationIcons, 0);
  });
  
  // Триггерим drawCallback вручную для начального рендеринга
  if (config.renderType === 'grid') {
    dataTable.draw();
  }
}

/**
 * Инициализация всех DataTables элементов
 */
function initAllDataTables() {
  const tables = document.querySelectorAll('[data-datatables-init="true"]');
  
  tables.forEach(table => {
    initDataTable(table);
  });
}

/**
 * Настройка инициализации для динамически добавленных элементов
 */
function setupDynamicInit() {
  // Используем MutationObserver для отслеживания новых элементов
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          // Проверяем, является ли узел таблицей
          if (node.tagName === 'TABLE' && node.hasAttribute('data-datatables-init')) {
            if (node.getAttribute('data-datatables-init') === 'true') {
              initDataTable(node);
            }
          }
          // Проверяем дочерние элементы
          const tables = node.querySelectorAll && node.querySelectorAll('[data-datatables-init="true"]');
          if (tables) {
            tables.forEach(table => {
              initDataTable(table);
            });
          }
        }
      });
    });
  });

  // Наблюдаем за изменениями в body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

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

    // Настройка инициализации для динамически добавленных элементов
    setupDynamicInit();
    
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
