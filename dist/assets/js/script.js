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
exports.DataTablesInit = void 0;
exports.initDataTablesModule = initDataTablesModule;
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
  pageLength: 18,
  // Показывать 18 компаний на странице (9 строк в две колонки)
  lengthMenu: [[18, 36, 54, -1], [18, 36, 54, 'Все']],
  order: [],
  // Без сортировки по умолчанию
  searching: false,
  // Отключаем поиск
  paging: true,
  info: false,
  // Скрываем информацию
  autoWidth: false,
  responsive: false,
  dom: 'rtp',
  // Только таблица и пагинация (без поиска, длины, информации)
  drawCallback: function () {
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
  dataTable.rows({
    search: 'applied'
  }).every(function () {
    const data = this.data();
    allCompanies.push(data[0]); // Берем первую колонку
  });

  // Получаем компании для текущей страницы
  const pageCompanies = allCompanies.slice(start, end);

  // Заполняем сетку компаниями текущей страницы в две колонки
  let html = '';
  pageCompanies.forEach(company => {
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
  $pagination.find('a[data-page]').on('click', function (e) {
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
  let config = {
    ...defaultConfig
  };
  const configAttr = $table.attr('data-datatable-config');
  if (configAttr) {
    try {
      const customConfig = JSON.parse(configAttr);
      config = {
        ...config,
        ...customConfig
      };
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
  $tables.each(function () {
    const $table = jQuery(this);
    initDataTable($table);
  });
}

/**
 * Публичный API для ручной инициализации
 */
const DataTablesInit = exports.DataTablesInit = {
  /**
   * Инициализировать конкретную таблицу
   * @param {string|jQuery} selector - селектор или jQuery элемент
   * @param {object} customConfig - кастомная конфигурация
   */
  init: function (selector, customConfig = {}) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.DataTable === 'undefined') {
      console.warn('DataTables: jQuery или DataTables не загружены');
      return null;
    }
    const $table = typeof selector === 'string' ? jQuery(selector) : selector;
    if ($table.length && $table.is('table')) {
      const config = {
        ...defaultConfig,
        ...customConfig
      };
      return $table.DataTable(config);
    }
    return null;
  },
  /**
   * Уничтожить DataTables для таблицы
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  destroy: function (selector) {
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
  reinit: function () {
    initAllDataTables();
  }
};

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

// Экспортируем для глобального доступа (если нужно)
if (typeof window !== 'undefined') {
  window.DataTablesInit = DataTablesInit;
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
