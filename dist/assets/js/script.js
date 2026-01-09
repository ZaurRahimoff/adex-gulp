(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _swiper = require("./modules/swiper");
var _eventProgramTabs = require("./modules/event-program-tabs");
var _videoPlay = require("./modules/video-play");
var _mobileMenu = require("./modules/mobile-menu");
var _scrollToTop = require("./modules/scroll-to-top");
var _select = require("./modules/select2");
var _datatables = require("./modules/datatables");
// Main JavaScript file
// Импорт модулей

// Инициализация всех модулей после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // Инициализация Swiper слайдеров
  (0, _swiper.initSwiperSliders)();

  // Инициализация вкладок программы мероприятия
  (0, _eventProgramTabs.initEventProgramTabs)();

  // Инициализация управления видео
  (0, _videoPlay.initVideoPlay)();

  // Инициализация мобильного меню
  (0, _mobileMenu.initMobileMenu)();

  // Инициализация кнопки прокрутки наверх
  (0, _scrollToTop.initScrollToTop)();

  // Инициализация Select2
  (0, _select.initSelect2Module)();

  // Инициализация DataTables
  (0, _datatables.initDataTablesModule)();
});

},{"./modules/datatables":2,"./modules/event-program-tabs":3,"./modules/mobile-menu":4,"./modules/scroll-to-top":5,"./modules/select2":6,"./modules/swiper":7,"./modules/video-play":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDataTablesModule = initDataTablesModule;
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
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']],
    searching: false,
    info: false,
    lengthChange: false,
    paging: true,
    order: [],
    autoWidth: false,
    responsive: false,
    // По умолчанию отключен (требует Responsive extension)
    renderType: 'table',
    // 'grid' или 'table'
    gridContainer: '[data-grid-container]',
    // селектор контейнера для grid
    gridCardClass: 'datatable--grid__card',
    // класс карточки для grid
    blockClass: 'datatable',
    // базовый класс блока
    language: {
      paginate: {
        previous: 'After',
        next: 'Before'
      }
    },
    dom: 'rt<"datatable__pagination-wrapper"p>'
  };

  // Начинаем с дефолтной конфигурации
  let config = {
    ...defaultConfig
  };

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
      config = {
        ...config,
        ...customConfig
      };
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
  const CUSTOM_SETTINGS_KEYS = ['renderType',
  // Наш тип рендеринга: 'grid' или 'table'
  'gridContainer',
  // Селектор контейнера для grid
  'gridCardClass',
  // Класс карточки для grid
  'blockClass',
  // Базовый BEM класс блока
  'title',
  // Заголовок блока
  'showHeader',
  // Показывать ли header
  'cardClass',
  // Класс для карточек
  'cardAltClass',
  // Класс для альтернативных карточек
  'gridColumns' // Количество колонок в grid
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
      const visibleRows = api.rows({
        page: 'current'
      }).nodes();

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
      const visibleRows = api.rows({
        page: 'current'
      }).nodes();

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
function initDataTablesModule() {
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initEventProgramTabs = initEventProgramTabs;
/**
 * Модуль для управления вкладками программы мероприятия
 */
function initEventProgramTabs() {
  const eventProgramTabs = document.querySelectorAll('.event-program-section__tab');
  if (eventProgramTabs.length > 0) {
    eventProgramTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Удаляем активный класс со всех вкладок
        eventProgramTabs.forEach(t => t.classList.remove('event-program-section__tab--active'));
        // Добавляем активный класс к нажатой вкладке
        this.classList.add('event-program-section__tab--active');
        // Получаем выбранный день
        const day = this.getAttribute('data-day');
        console.log('Selected day:', day);
        // Здесь можно добавить логику загрузки программы для выбранного дня
      });
    });
  }
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMobileMenu = initMobileMenu;
/**
 * Модуль для управления мобильным меню
 */
function initMobileMenu() {
  // Анимация переключателя мобильного меню
  const topbarToggle = document.querySelector('.topbar__toggle');
  const navbarMobileMenu = document.querySelector('#navbarMobileMenu');
  if (topbarToggle && navbarMobileMenu) {
    navbarMobileMenu.addEventListener('show.bs.offcanvas', function () {
      topbarToggle.setAttribute('aria-expanded', 'true');
    });
    navbarMobileMenu.addEventListener('hide.bs.offcanvas', function () {
      topbarToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Анимация иконок выпадающих меню в мобильной версии
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link[data-bs-toggle="collapse"]');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      if (target) {
        target.addEventListener('shown.bs.collapse', function () {
          link.setAttribute('aria-expanded', 'true');
        });
        target.addEventListener('hidden.bs.collapse', function () {
          link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initScrollToTop = initScrollToTop;
/**
 * Модуль для кнопки прокрутки наверх
 */
function initScrollToTop() {
  const scrollToTopBtns = document.querySelectorAll('.footer__scroll-top');
  scrollToTopBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select2Init = void 0;
exports.initSelect2Module = initSelect2Module;
/**
 * Select2 Module - универсальная инициализация Select2
 * Автоматически инициализирует все элементы с классом .select2 и атрибутом data-select2-init="true"
 * 
 * Использование в HTML:
 * <select class="select2" data-select2-init="true">
 *   <option value="1">Option 1</option>
 * </select>
 */

// Дефолтная конфигурация
const defaultConfig = {
  placeholder: 'Выберите...',
  allowClear: false,
  width: '100%',
  minimumResultsForSearch: Infinity // Скрыть поиск для небольших списков
};

/**
 * Инициализация Select2 для элемента
 * @param {jQuery} $element - jQuery элемент select
 */
function initSelect2($element) {
  // Проверка наличия jQuery и Select2
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
    console.warn('Select2: jQuery или Select2 не загружены');
    return;
  }

  // Получаем конфигурацию из data-атрибута или используем дефолтную
  let config = {
    ...defaultConfig
  };
  const $wrapper = $element.closest('.select2-wrapper');
  if ($wrapper.length) {
    const configAttr = $wrapper.attr('data-select2-config');
    if (configAttr) {
      try {
        const customConfig = JSON.parse(configAttr);
        config = {
          ...config,
          ...customConfig
        };
      } catch (e) {
        console.warn('Select2: Ошибка парсинга конфигурации', e);
      }
    }
  }

  // Проверяем, является ли это мультиселектом
  const isMultiple = $element.attr('multiple') !== undefined || $wrapper.attr('data-select2-multiple') === 'true' || $element.prop('multiple') === true;

  // Для мультиселекта добавляем специальные опции
  if (isMultiple) {
    config.closeOnSelect = config.closeOnSelect !== undefined ? config.closeOnSelect : false;
    // Если placeholder не переопределен, используем дефолтный для мультиселекта
    if (!config.placeholder || config.placeholder === defaultConfig.placeholder) {
      config.placeholder = config.placeholder || 'Выберите элементы...';
    }
  }

  // Инициализация Select2
  $element.select2(config);

  // Применение кастомных классов к контейнеру на основе варианта стиля
  // Используем событие select2:select для гарантии создания контейнера
  const applyStyles = () => {
    const $container = $element.next('.select2-container');
    if ($container.length) {
      // Читаем вариант стиля из data-атрибута
      const variant = $element.attr('data-select2-variant') || 'default';
      const validVariants = ['default', 'primary', 'secondary'];
      if (validVariants.includes(variant)) {
        // Удаляем все варианты стилей
        $container.removeClass('select2-container--default select2-container--primary select2-container--secondary');
        // Применяем нужный вариант
        $container.addClass(`select2-container--${variant}`);
      }
    } else {
      // Если контейнер еще не создан, пробуем через небольшую задержку
      setTimeout(applyStyles, 10);
    }
  };

  // Пытаемся применить стили сразу
  applyStyles();

  // Также применяем после события select2:select
  $element.on('select2:select select2:unselect', applyStyles);

  // Обработка событий (опционально)
  $element.on('select2:open', function () {
    // Дополнительная логика при открытии
  });
  $element.on('select2:close', function () {
    // Дополнительная логика при закрытии
  });
  $element.on('change', function () {
    // Дополнительная логика при изменении
  });
}

/**
 * Инициализация всех Select2 элементов на странице
 */
function initAllSelect2() {
  // Проверка наличия jQuery и Select2
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
    console.warn('Select2: jQuery или Select2 не загружены');
    return;
  }
  const $selects = jQuery('select[data-select2-init="true"]');
  $selects.each(function () {
    const $select = jQuery(this);

    // Проверяем, не инициализирован ли уже
    if (!$select.hasClass('select2-hidden-accessible')) {
      initSelect2($select);
    }
  });
}

/**
 * Публичный API для ручной инициализации
 */
const Select2Init = exports.Select2Init = {
  /**
   * Инициализировать конкретный элемент
   * @param {string|jQuery} selector - селектор или jQuery элемент
   * @param {object} customConfig - кастомная конфигурация
   */
  init: function (selector, customConfig = {}) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
      console.warn('Select2: jQuery или Select2 не загружены');
      return;
    }
    const $element = typeof selector === 'string' ? jQuery(selector) : selector;
    if ($element.length && $element.is('select')) {
      const config = {
        ...defaultConfig,
        ...customConfig
      };
      $element.select2(config);
    }
  },
  /**
   * Уничтожить Select2 для элемента
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  destroy: function (selector) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
      console.warn('Select2: jQuery или Select2 не загружены');
      return;
    }
    const $element = typeof selector === 'string' ? jQuery(selector) : selector;
    if ($element.length) {
      $element.select2('destroy');
    }
  },
  /**
   * Переинициализировать все Select2 на странице
   */
  reinit: function () {
    initAllSelect2();
  }
};

/**
 * Инициализация Select2 модуля
 * Вызывается автоматически при загрузке DOM
 */
function initSelect2Module() {
  // Функция для попытки инициализации
  function tryInit() {
    // Проверка наличия jQuery и Select2
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
      return false;
    }

    // Инициализация всех Select2 элементов
    initAllSelect2();

    // Настройка инициализации для динамически добавленных элементов
    setupDynamicInit();
    return true;
  }

  // Пытаемся инициализировать сразу
  if (tryInit()) {
    return;
  }

  // Если не получилось, ждем загрузки скриптов
  // Используем window.onload для гарантии загрузки всех скриптов
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

/**
 * Настройка инициализации для динамически добавленных элементов
 */
function setupDynamicInit() {
  if (typeof jQuery === 'undefined') {
    return;
  }

  // Используем MutationObserver для отслеживания динамически добавленных элементов
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          // Element node
          const $node = jQuery(node);
          const $selects = $node.find('select[data-select2-init="true"]').add($node.filter('select[data-select2-init="true"]'));
          if ($selects.length) {
            $selects.each(function () {
              const $select = jQuery(this);
              if (!$select.hasClass('select2-hidden-accessible')) {
                initSelect2($select);
              }
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

// Экспортируем для глобального доступа (если нужно)
if (typeof window !== 'undefined') {
  window.Select2Init = Select2Init;
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSwiperSliders = initSwiperSliders;
/**
 * Универсальный модуль для инициализации Swiper слайдеров
 * Настройки читаются из data-атрибутов HTML элемента
 * 
 * Использование в HTML:
 * <div class="swiper" 
 *      data-swiper
 *      data-slides-per-view="1"
 *      data-space-between="20"
 *      data-loop="true"
 *      data-nav-prev=".prev-btn"
 *      data-nav-next=".next-btn"
 *      data-breakpoints='{"576":{"slidesPerView":2},"768":{"slidesPerView":3}}'>
 *   ...
 * </div>
 */
function initSwiperSliders() {
  // Инициализируем все слайдеры с классом .swiper
  const swiperContainers = document.querySelectorAll('.swiper');
  swiperContainers.forEach(container => {
    // Пропускаем если уже инициализирован
    if (container.swiperInstance) {
      return;
    }
    const config = parseSwiperConfig(container);
    const swiper = new Swiper(container, config);

    // Специальная обработка для photo-swiper
    if (container.classList.contains('photo-swiper')) {
      // Для auto slidesPerView с разными размерами слайдов
      if (swiper.params.slidesPerView === 'auto' && swiper.params.loop) {
        swiper.params.loopAdditionalSlides = 3;
        swiper.params.loopedSlides = 6;
        swiper.params.watchSlidesProgress = true;
        swiper.params.watchSlidesVisibility = true;
      }

      // Флаг для предотвращения множественных обновлений
      let isUpdating = false;

      // Функция безопасного обновления
      const safeUpdate = () => {
        if (isUpdating) return;
        isUpdating = true;
        requestAnimationFrame(() => {
          swiper.update();
          isUpdating = false;
        });
      };

      // Обновляем размеры после инициализации (один раз)
      setTimeout(() => {
        swiper.update();
      }, 150);

      // Обновляем только после завершения перехода
      swiper.on('slideChangeTransitionEnd', function () {
        safeUpdate();
      });

      // Предотвращаем обновление во время перехода
      swiper.on('slideChangeTransitionStart', function () {
        // Не обновляем во время перехода
      });

      // Обновляем при изменении размера окна
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!swiper.destroyed) {
            swiper.update();
          }
        }, 250);
      };
      window.addEventListener('resize', handleResize);

      // Очистка при уничтожении
      swiper.on('destroy', () => {
        window.removeEventListener('resize', handleResize);
      });
    }

    // Сохраняем экземпляр Swiper для доступа извне
    container.swiperInstance = swiper;
  });
}

/**
 * Парсит настройки Swiper из data-атрибутов элемента
 * @param {HTMLElement} element - Элемент со слайдером
 * @returns {Object} Конфигурация Swiper
 */
function parseSwiperConfig(element) {
  // Поддержка "auto" для slidesPerView
  const slidesPerViewValue = element.dataset.slidesPerView;
  const slidesPerView = slidesPerViewValue === 'auto' ? 'auto' : parseInt(slidesPerViewValue) || 1;
  const config = {
    slidesPerView: slidesPerView,
    spaceBetween: parseInt(element.dataset.spaceBetween) || 20,
    loop: element.dataset.loop === 'true' || element.dataset.loop === '',
    centeredSlides: element.dataset.centeredSlides === 'true' || element.dataset.centeredSlides === '',
    speed: parseInt(element.dataset.speed) || 300,
    autoplay: element.dataset.autoplay ? {
      delay: parseInt(element.dataset.autoplayDelay) || 3000,
      disableOnInteraction: element.dataset.autoplayDisableOnInteraction !== 'false'
    } : false
  };

  // Добавляем loopAdditionalSlides для корректной работы loop с auto
  if (config.slidesPerView === 'auto' && config.loop) {
    config.loopAdditionalSlides = 4;
    config.loopedSlides = 8;
    config.watchSlidesProgress = true;
    config.watchSlidesVisibility = true;
  }

  // Навигация - ищем кнопки навигации по селекторам или по классам
  let navPrev = element.dataset.navPrev;
  let navNext = element.dataset.navNext;

  // Если селекторы не указаны, пытаемся найти кнопки по стандартным классам
  if (!navPrev || !navNext) {
    const parent = element.closest('section');
    if (parent) {
      // Ищем кнопки навигации в родительской секции
      const prevBtn = parent.querySelector('[class*="nav-btn--prev"], [class*="nav-prev"]');
      const nextBtn = parent.querySelector('[class*="nav-btn--next"], [class*="nav-next"]');
      if (prevBtn && nextBtn) {
        // Если нашли элементы, используем их напрямую
        navPrev = navPrev || prevBtn;
        navNext = navNext || nextBtn;
      }
    }
  }
  if (navPrev && navNext) {
    config.navigation = {
      // Если это строка (селектор), используем как есть, иначе передаем элемент
      nextEl: typeof navNext === 'string' ? navNext : navNext,
      prevEl: typeof navPrev === 'string' ? navPrev : navPrev
    };
  }

  // Пагинация
  const pagination = element.dataset.pagination;
  if (pagination) {
    config.pagination = {
      el: pagination,
      clickable: element.dataset.paginationClickable !== 'false',
      type: element.dataset.paginationType || 'bullets'
    };
  }

  // Breakpoints
  const breakpoints = parseBreakpoints(element);
  if (breakpoints && Object.keys(breakpoints).length > 0) {
    config.breakpoints = breakpoints;
  }

  // Дополнительные опции из JSON
  if (element.dataset.swiperOptions) {
    try {
      const customOptions = JSON.parse(element.dataset.swiperOptions);
      Object.assign(config, customOptions);
    } catch (e) {
      console.warn('Не удалось распарсить data-swiper-options:', e);
    }
  }
  return config;
}

/**
 * Парсит breakpoints из data-атрибутов
 * Формат: data-breakpoints='{"576":{"slidesPerView":2},"768":{"slidesPerView":3}}'
 * или отдельные атрибуты: data-breakpoint-576-slides-per-view="2"
 * @param {HTMLElement} element - Элемент со слайдером
 * @returns {Object} Объект с breakpoints
 */
function parseBreakpoints(element) {
  const breakpoints = {};

  // Вариант 1: JSON в data-breakpoints
  if (element.dataset.breakpoints) {
    try {
      return JSON.parse(element.dataset.breakpoints);
    } catch (e) {
      console.warn('Не удалось распарсить data-breakpoints:', e);
    }
  }

  // Вариант 2: Отдельные атрибуты data-breakpoint-{width}-{option}
  const breakpointPattern = /^breakpoint-(\d+)-(.+)$/;
  const dataAttrs = Object.keys(element.dataset);
  dataAttrs.forEach(attr => {
    const match = attr.match(breakpointPattern);
    if (match) {
      const width = parseInt(match[1]);
      const option = camelCase(match[2]);
      if (!breakpoints[width]) {
        breakpoints[width] = {};
      }
      const value = element.dataset[attr];
      breakpoints[width][option] = parseValue(value);
    }
  });
  return breakpoints;
}

/**
 * Преобразует kebab-case в camelCase
 * @param {string} str - Строка в kebab-case
 * @returns {string} Строка в camelCase
 */
function camelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

/**
 * Парсит значение в правильный тип (число, boolean, строка)
 * @param {string} value - Значение для парсинга
 * @returns {*} Парсенное значение
 */
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value) && value !== '') return parseInt(value);
  return value;
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initVideoPlay = initVideoPlay;
/**
 * Модуль для управления воспроизведением видео
 */
function initVideoPlay() {
  const videoPlayButtons = document.querySelectorAll('.hero__play-btn, .video-section__play-btn');
  videoPlayButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const videoWrapper = this.closest('.hero, .video-section');
      if (!videoWrapper) return;

      // Ищем iframe или video элемент
      const iframe = videoWrapper.querySelector('iframe.hero__video');
      const video = videoWrapper.querySelector('video');
      if (iframe) {
        // Для YouTube iframe
        const src = iframe.src;
        const isPlaying = src.includes('autoplay=1');
        if (!isPlaying) {
          // Добавляем autoplay к URL
          const separator = src.includes('?') ? '&' : '?';
          iframe.src = src + separator + 'autoplay=1';
          this.style.display = 'none';
        }
      } else if (video) {
        // Для обычного video элемента
        if (video.paused) {
          video.play();
          this.style.display = 'none';
        } else {
          video.pause();
          this.style.display = 'flex';
        }
      }
    });
  });
}

},{}]},{},[1])

//# sourceMappingURL=script.js.map
