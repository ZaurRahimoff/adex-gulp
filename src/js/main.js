// Main JavaScript file
// Initialize Swiper sliders

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Sponsors Swiper
  if (document.querySelector('.sponsors-swiper')) {
    const sponsorsSwiper = new Swiper('.sponsors-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.sponsors-section__nav-btn--next',
        prevEl: '.sponsors-section__nav-btn--prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
        1440: {
          slidesPerView: 6,
        },
      },
    });
  }

  // Initialize Support Swiper
  if (document.querySelector('.support-swiper')) {
    const supportSwiper = new Swiper('.support-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.support-section__nav-btn--next',
        prevEl: '.support-section__nav-btn--prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
        1440: {
          slidesPerView: 6,
        },
      },
    });
  }

  // Initialize Product Categories Swiper
  if (document.querySelector('.product-categories-swiper')) {
    const productCategoriesSwiper = new Swiper('.product-categories-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.product-categories-section__nav-btn--next',
        prevEl: '.product-categories-section__nav-btn--prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
        1440: {
          slidesPerView: 6,
        },
      },
    });
  }

  // Initialize Photo Swiper
  if (document.querySelector('.photo-swiper')) {
    const photoSwiper = new Swiper('.photo-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.photo-section__nav-btn--next',
        prevEl: '.photo-section__nav-btn--prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      },
    });
  }

  // Initialize Testimonials Swiper
  if (document.querySelector('.testimonials-swiper')) {
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.testimonials-section__nav-btn--next',
        prevEl: '.testimonials-section__nav-btn--prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      },
    });
  }

  // Event Program Tabs
  const eventProgramTabs = document.querySelectorAll('.event-program-section__tab');
  if (eventProgramTabs.length > 0) {
    eventProgramTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        eventProgramTabs.forEach(t => t.classList.remove('event-program-section__tab--active'));
        // Add active class to clicked tab
        this.classList.add('event-program-section__tab--active');
        // Here you would load the program for the selected day
        const day = this.getAttribute('data-day');
        console.log('Selected day:', day);
      });
    });
  }

  // Video play buttons
  const videoPlayButtons = document.querySelectorAll('.hero__play-btn, .video-section__play-btn');
  videoPlayButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const videoWrapper = this.closest('.hero, .video-section');
      const video = videoWrapper?.querySelector('video');
      if (video) {
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

  // Mobile menu toggle animation
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

  // Mobile dropdown icons animation
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

  // Footer scroll to top button
  const scrollToTopBtn = document.querySelector('.footer__scroll-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

