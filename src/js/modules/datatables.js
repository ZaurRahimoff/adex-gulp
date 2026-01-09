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
    lengthMenu: [
      [10, 20, 50, -1],
      [10, 20, 50, 'All'],
    ],
    searching: false,
    info: false,
    lengthChange: false,
    paging: true,
    order: [],
    autoWidth: false,
    responsive: false, // По умолчанию отключен (требует Responsive extension)
    renderType: 'table', // 'grid' или 'table'
    gridContainer: '[data-grid-container]', // селектор контейнера для grid
    gridCardClass: 'datatable--grid__card', // класс карточки для grid
    blockClass: 'datatable', // базовый класс блока
    language: {
      paginate: {
        previous: 'After',
        next: 'Before',
      },
    },
    dom: 'rt<"datatable__pagination-wrapper"p>',
  };

  // Начинаем с дефолтной конфигурации
  let config = { ...defaultConfig };

  // Сначала парсим JSON конфигурацию из data-атрибута (если есть)
  const configAttr = $table.attr('data-datatables-config');
  if (configAttr) {
    try {
      // Обрабатываем HTML-сущности
      let configStr = configAttr;
      // Заменяем все варианты HTML-сущностей
      configStr = configStr.replace(/&quot;/g, '"');
      configStr = configStr.replace(/&#39;/g, "'");
      configStr = configStr.replace(/&amp;/g, '&');
      configStr = configStr.replace(/&lt;/g, '<');
      configStr = configStr.replace(/&gt;/g, '>');

      const customConfig = JSON.parse(configStr);
      config = { ...config, ...customConfig };
    } catch (e) {
      console.warn('DataTables: Ошибка парсинга конфигурации', e, configAttr);
    }
  }

  // Затем переопределяем отдельными data-атрибутами (они имеют приоритет)
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

  // Обработка responsive (может быть строкой "true"/"false" или boolean)
  if ($table.attr('data-responsive') !== undefined) {
    const responsiveAttr = $table.attr('data-responsive');
    config.responsive = responsiveAttr === 'true' || responsiveAttr === true;
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

  // Обновляем dom в зависимости от типа рендеринга
  if (config.renderType === 'table') {
    // Для table режима показываем thead (t включает thead)
    config.dom = `t<"${config.blockClass}__pagination-wrapper"p>`;
  } else {
    // Для grid режима скрываем таблицу
    config.dom = `<"${config.blockClass}__content-wrapper"rt><"${config.blockClass}__pagination-wrapper"p>`;
  }

  // Применяем responsive настройку
  if (config.responsive === true || config.responsive === 'true') {
    config.responsive = true;
  } else {
    config.responsive = false;
  }

  // Список ТОЛЬКО кастомных настроек нашего компонента (не DataTables)
  const CUSTOM_SETTINGS_KEYS = [
    'renderType',      // Наш тип рендеринга: 'grid' или 'table'
    'gridContainer',   // Селектор контейнера для grid
    'gridCardClass',   // Класс карточки для grid
    'blockClass',      // Базовый BEM класс блока
    'title',           // Заголовок блока
    'showHeader',      // Показывать ли header
    'cardClass',       // Класс для карточек
    'cardAltClass',    // Класс для альтернативных карточек
    'gridColumns',     // Количество колонок в grid
  ];

  // Разделяем настройки на стандартные (для DataTables) и кастомные (для нашего компонента)
  const customSettings = {};
  const dataTablesConfig = {};

  // Проходим по всем настройкам и разделяем их
  Object.keys(config).forEach(key => {
    if (CUSTOM_SETTINGS_KEYS.includes(key)) {
      // Это кастомная настройка компонента
      customSettings[key] = config[key];
    } else {
      // Это стандартная настройка DataTables
      dataTablesConfig[key] = config[key];
    }
  });

  // Для table режима columns используется в customSettings для data-атрибутов
  // Сохраняем его в customSettings и удаляем из dataTablesConfig
  if (customSettings.renderType === 'table' && config.columns) {
    customSettings.columns = config.columns;
    delete dataTablesConfig.columns;
  }

  // Настройка drawCallback в зависимости от типа рендеринга
  if (customSettings.renderType === 'grid') {
    dataTablesConfig.drawCallback = function (settings) {
      const api = this.api();
      const pageInfo = api.page.info();

      // Находим контейнер для grid
      const $grid = $wrapper.find(customSettings.gridContainer);
      if ($grid.length === 0) return;

      // Очищаем grid
      $grid.empty();

      // Получаем видимые строки текущей страницы
      const visibleRows = api.rows({ page: 'current' }).nodes();

      // Создаем карточки для видимых строк в две колонки
      jQuery(visibleRows).each(function (rowIndex) {
        const $row = jQuery(this);
        const $firstCell = $row.find('td').first();
        const cellText = $firstCell.text();

        // Создаем колонку Bootstrap для двухколоночного layout
        const $col = jQuery('<div>').addClass('col');

        // Создаем карточку с правильным классом
        const $card = jQuery('<div>').addClass(customSettings.gridCardClass).text(cellText);

        // Добавляем класс --alt для нечетных карточек (чередование цветов)
        // В первом ряду: обе карточки alt
        // Во втором ряду: обе карточки без alt
        // И так далее...
        const rowNumber = Math.floor(rowIndex / 2);
        if (rowNumber % 2 === 0) {
          $card.addClass(`${customSettings.gridCardClass}--alt`);
        }

        $col.append($card);
        $grid.append($col);
      });
    };
  } else if (customSettings.renderType === 'table') {
    // Для table типа используем стандартную таблицу DataTables
    // Применяем кастомные классы к строкам и ячейкам
    dataTablesConfig.drawCallback = function (settings) {
      const api = this.api();
      const visibleRows = api.rows({ page: 'current' }).nodes();

      // Применяем стили к строкам таблицы
      jQuery(visibleRows).each(function () {
        const $row = jQuery(this);
        $row.addClass(`${customSettings.blockClass}__row`);
        
        // Применяем стили к ячейкам
        $row.find('td').each(function (index) {
          const $cell = jQuery(this);
          $cell.addClass(`${customSettings.blockClass}__cell`);
          
          // Добавляем data-column атрибут если есть информация о колонках
          if (customSettings.columns && customSettings.columns[index]) {
            $cell.attr('data-column', customSettings.columns[index].key);
          }
        });
      });
    };
  }

  // Инициализация DataTables с очищенной конфигурацией
  const dataTable = $table.DataTable(dataTablesConfig);

  // Настройка пагинации
  const $dataTablesWrapper = $table.closest('.dataTables_wrapper');
  const $paginationContainer = $dataTablesWrapper.find(`.${customSettings.blockClass}__pagination-wrapper`);

  // Пагинация остается внутри wrapper для корректного отображения
  // (больше не перемещаем её наружу)

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

  // Добавляем иконки при каждом обновлении пагинации
  dataTable.on('draw', function () {
    setTimeout(addPaginationIcons, 0);
  });

  // Добавляем иконки после инициализации
  addPaginationIcons();

  // Триггерим drawCallback вручную для начального рендеринга
  if (customSettings.renderType === 'grid') {
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
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          // Element node
          // Проверяем, является ли узел таблицей
          if (node.tagName === 'TABLE' && node.hasAttribute('data-datatables-init')) {
            if (node.getAttribute('data-datatables-init') === 'true') {
              initDataTable(node);
            }
          }
          // Проверяем дочерние элементы
          const tables =
            node.querySelectorAll && node.querySelectorAll('[data-datatables-init="true"]');
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
    subtree: true,
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
    window.addEventListener('load', function () {
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
