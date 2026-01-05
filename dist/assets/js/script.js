(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _swiper = require("./modules/swiper");
var _eventProgramTabs = require("./modules/event-program-tabs");
var _videoPlay = require("./modules/video-play");
var _mobileMenu = require("./modules/mobile-menu");
var _scrollToTop = require("./modules/scroll-to-top");
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
});

},{"./modules/event-program-tabs":2,"./modules/mobile-menu":3,"./modules/scroll-to-top":4,"./modules/swiper":5,"./modules/video-play":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
