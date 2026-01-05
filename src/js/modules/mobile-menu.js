/**
 * Модуль для управления мобильным меню
 */
export function initMobileMenu() {
  // Анимация переключателя мобильного меню
  const topbarToggle = document.querySelector('.topbar__toggle');
  const navbarMobileMenu = document.querySelector('#navbarMobileMenu');
  
  if (topbarToggle && navbarMobileMenu) {
    navbarMobileMenu.addEventListener('show.bs.offcanvas', function() {
      topbarToggle.setAttribute('aria-expanded', 'true');
    });

    navbarMobileMenu.addEventListener('hide.bs.offcanvas', function() {
      topbarToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Анимация иконок выпадающих меню в мобильной версии
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link[data-bs-toggle="collapse"]');
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      const targetId = this.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      
      if (target) {
        target.addEventListener('shown.bs.collapse', function() {
          link.setAttribute('aria-expanded', 'true');
        });

        target.addEventListener('hidden.bs.collapse', function() {
          link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });
}
