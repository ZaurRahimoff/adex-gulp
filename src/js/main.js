// Main JavaScript file
// Импорт модулей
import { initSwiperSliders } from './modules/swiper';
import { initEventProgramTabs } from './modules/event-program-tabs';
import { initVideoPlay } from './modules/video-play';
import { initMobileMenu } from './modules/mobile-menu';
import { initScrollToTop } from './modules/scroll-to-top';

// Инициализация всех модулей после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация Swiper слайдеров
  initSwiperSliders();

  // Инициализация вкладок программы мероприятия
  initEventProgramTabs();

  // Инициализация управления видео
  initVideoPlay();

  // Инициализация мобильного меню
  initMobileMenu();

  // Инициализация кнопки прокрутки наверх
  initScrollToTop();
});

