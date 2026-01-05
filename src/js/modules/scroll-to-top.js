/**
 * Модуль для кнопки прокрутки наверх
 */
export function initScrollToTop() {
  const scrollToTopBtns = document.querySelectorAll('.footer__scroll-top');
  
  scrollToTopBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}
