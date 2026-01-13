/**
 * Nice Select Module
 * Инициализация jquery-nice-select для селектов
 */

/**
 * Инициализация Nice Select для конкретного элемента
 * @param {jQuery|HTMLElement|string} element - элемент для инициализации
 */
function initNiceSelect(element) {
  // Проверка наличия jQuery и niceSelect
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.niceSelect === 'undefined') {
    console.warn('Nice Select: jQuery или niceSelect не загружены');
    return;
  }

  const $element = typeof element === 'string' 
    ? jQuery(element) 
    : jQuery(element);

  if ($element.length && $element.is('select')) {
    // Проверяем, не инициализирован ли уже
    if (!$element.closest('.nice-select').length) {
      $element.niceSelect();
    }
  }
}

/**
 * Инициализация всех Nice Select элементов на странице
 */
function initAllNiceSelect() {
  // Проверка наличия jQuery и niceSelect
  if (typeof jQuery === 'undefined' || typeof jQuery.fn.niceSelect === 'undefined') {
    console.warn('Nice Select: jQuery или niceSelect не загружены');
    return;
  }

  const $selects = jQuery('select[data-nice-select-init="true"]');
  
  $selects.each(function() {
    const $select = jQuery(this);
    initNiceSelect($select);
  });
}

/**
 * Публичный API для ручной инициализации
 */
export const NiceSelectInit = {
  /**
   * Инициализировать конкретный элемент
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  init: function(selector) {
    initNiceSelect(selector);
  },

  /**
   * Уничтожить Nice Select для элемента
   * @param {string|jQuery} selector - селектор или jQuery элемент
   */
  destroy: function(selector) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.niceSelect === 'undefined') {
      console.warn('Nice Select: jQuery или niceSelect не загружены');
      return;
    }

    const $element = typeof selector === 'string' ? jQuery(selector) : jQuery(selector);
    
    if ($element.length) {
      $element.niceSelect('destroy');
    }
  },

  /**
   * Переинициализировать все Nice Select на странице
   */
  reinit: function() {
    initAllNiceSelect();
  }
};

/**
 * Инициализация Nice Select модуля
 * Вызывается автоматически при загрузке DOM
 */
export function initNiceSelectModule() {
  // Функция для попытки инициализации
  function tryInit() {
    // Проверка наличия jQuery и niceSelect
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.niceSelect === 'undefined') {
      return false;
    }

    // Инициализация всех Nice Select элементов
    initAllNiceSelect();
    
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
