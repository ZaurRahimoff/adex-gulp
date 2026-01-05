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
export function initSwiperSliders() {
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
      swiper.on('slideChangeTransitionEnd', function() {
        safeUpdate();
      });
      
      // Предотвращаем обновление во время перехода
      swiper.on('slideChangeTransitionStart', function() {
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
  const slidesPerView = slidesPerViewValue === 'auto' ? 'auto' : (parseInt(slidesPerViewValue) || 1);
  
  const config = {
    slidesPerView: slidesPerView,
    spaceBetween: parseInt(element.dataset.spaceBetween) || 20,
    loop: element.dataset.loop === 'true' || element.dataset.loop === '',
    centeredSlides: element.dataset.centeredSlides === 'true' || element.dataset.centeredSlides === '',
    speed: parseInt(element.dataset.speed) || 300,
    autoplay: element.dataset.autoplay ? {
      delay: parseInt(element.dataset.autoplayDelay) || 3000,
      disableOnInteraction: element.dataset.autoplayDisableOnInteraction !== 'false'
    } : false,
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
      prevEl: typeof navPrev === 'string' ? navPrev : navPrev,
    };
  }

  // Пагинация
  const pagination = element.dataset.pagination;
  if (pagination) {
    config.pagination = {
      el: pagination,
      clickable: element.dataset.paginationClickable !== 'false',
      type: element.dataset.paginationType || 'bullets',
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
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
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
