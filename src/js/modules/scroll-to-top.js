/**
 * Модуль для кнопки прокрутки наверх
 */
export function initScrollToTop() {
  const scrollToTopBtn = document.querySelector('.footer__scroll-top');
  
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
