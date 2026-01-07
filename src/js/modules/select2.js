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
  minimumResultsForSearch: Infinity, // Скрыть поиск для небольших списков
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
  let config = { ...defaultConfig };
  
  const $wrapper = $element.closest('.select2-wrapper');
  if ($wrapper.length) {
    const configAttr = $wrapper.attr('data-select2-config');
    if (configAttr) {
      try {
        const customConfig = JSON.parse(configAttr);
        config = { ...config, ...customConfig };
      } catch (e) {
        console.warn('Select2: Ошибка парсинга конфигурации', e);
      }
    }
  }

  // Проверяем, является ли это мультиселектом
  const isMultiple = $element.attr('multiple') !== undefined || 
                     $wrapper.attr('data-select2-multiple') === 'true' ||
                     $element.prop('multiple') === true;

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
  $element.on('select2:open', function() {
    // Дополнительная логика при открытии
  });

  $element.on('select2:close', function() {
    // Дополнительная логика при закрытии
  });

  $element.on('change', function() {
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
  
  $selects.each(function() {
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
export const Select2Init = {
  /**
   * Инициализировать конкретный элемент
   * @param {string|jQuery} selector - селектор или jQuery элемент
   * @param {object} customConfig - кастомная конфигурация
   */
  init: function(selector, customConfig = {}) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.select2 === 'undefined') {
      console.warn('Select2: jQuery или Select2 не загружены');
      return;
    }

    const $element = typeof selector === 'string' ? jQuery(selector) : selector;
    
    if ($element.length && $element.is('select')) {
      const config = { ...defaultConfig, ...customConfig };
      $element.select2(config);
    }
  },

  /**
   * Уничтожить Select2 для элемента
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  destroy: function(selector) {
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
  reinit: function() {
    initAllSelect2();
  }
};

/**
 * Инициализация Select2 модуля
 * Вызывается автоматически при загрузке DOM
 */
export function initSelect2Module() {
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

/**
 * Настройка инициализации для динамически добавленных элементов
 */
function setupDynamicInit() {
  if (typeof jQuery === 'undefined') {
    return;
  }

  // Используем MutationObserver для отслеживания динамически добавленных элементов
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          const $node = jQuery(node);
          const $selects = $node.find('select[data-select2-init="true"]').add(
            $node.filter('select[data-select2-init="true"]')
          );
          
          if ($selects.length) {
            $selects.each(function() {
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
