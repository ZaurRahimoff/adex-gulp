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
 
	// Mobile menu toggle animation and menu cloning
	const topbarToggle = document.querySelector('.topbar__toggle');
	const navbarMobileMenu = document.querySelector('#navbarMobileMenu');
	const navbarMenu = document.querySelector('#navbarMenu');
	const navbarButtons = document.querySelector('#navbarButtons');
	const navbarMobileMenuWrapper = document.querySelector('#navbarMobileMenuWrapper');
	const navbarMobileButtons = document.querySelector('#navbarMobileButtons');
	let clonedMenu = null;
	let clonedButtons = null;
	
	if (topbarToggle && navbarMobileMenu && navbarMenu) {
	  navbarMobileMenu.addEventListener('show.bs.offcanvas', function() {
		 topbarToggle.setAttribute('aria-expanded', 'true');
		 
		 // Clone menu for mobile
		 if (!clonedMenu && navbarMenu) {
			clonedMenu = navbarMenu.cloneNode(true);
			clonedMenu.classList.remove('d-flex', 'align-items-center');
			clonedMenu.id = '';
			
			// Преобразуем дропдауны для мобильного вида - делаем их видимыми по клику
			const items = clonedMenu.querySelectorAll('.navbar__item');
			items.forEach((item, index) => {
			  const link = item.querySelector('.navbar__link');
			  const dropdown = item.querySelector('.navbar__dropdown');
			  
			  if (link && dropdown) {
				 // Скрываем дропдаун по умолчанию
				 dropdown.style.display = 'none';
				 dropdown.style.opacity = '0';
				 dropdown.style.visibility = 'hidden';
				 
				 // Добавляем обработчик клика для показа/скрытия дропдауна
				 link.addEventListener('click', function(e) {
					e.preventDefault();
					const isVisible = dropdown.style.display === 'flex';
					
					// Закрываем все другие дропдауны
					items.forEach(otherItem => {
					  if (otherItem !== item) {
						 const otherDropdown = otherItem.querySelector('.navbar__dropdown');
						 const otherIcon = otherItem.querySelector('.navbar__icon');
						 if (otherDropdown) {
							otherDropdown.style.display = 'none';
							otherDropdown.style.opacity = '0';
							otherDropdown.style.visibility = 'hidden';
						 }
						 if (otherIcon) {
							otherIcon.style.transform = 'rotate(0deg)';
						 }
					  }
					});
					
					// Переключаем текущий дропдаун
					if (isVisible) {
					  dropdown.style.display = 'none';
					  dropdown.style.opacity = '0';
					  dropdown.style.visibility = 'hidden';
					  const icon = item.querySelector('.navbar__icon');
					  if (icon) icon.style.transform = 'rotate(0deg)';
					} else {
					  dropdown.style.display = 'flex';
					  dropdown.style.opacity = '1';
					  dropdown.style.visibility = 'visible';
					  const icon = item.querySelector('.navbar__icon');
					  if (icon) icon.style.transform = 'rotate(180deg)';
					}
				 });
			  }
			});
			
			navbarMobileMenuWrapper.appendChild(clonedMenu);
		 }
		 
		 // Clone buttons for mobile
		 if (!clonedButtons && navbarButtons) {
			clonedButtons = navbarButtons.cloneNode(true);
			clonedButtons.classList.remove('d-none', 'd-lg-flex', 'align-items-center');
			clonedButtons.id = '';
			navbarMobileButtons.appendChild(clonedButtons);
		 }
	  });
 
	  navbarMobileMenu.addEventListener('hide.bs.offcanvas', function() {
		 topbarToggle.setAttribute('aria-expanded', 'false');
		 
		 // Remove cloned menu
		 if (clonedMenu) {
			clonedMenu.remove();
			clonedMenu = null;
		 }
		 
		 // Remove cloned buttons
		 if (clonedButtons) {
			clonedButtons.remove();
			clonedButtons = null;
		 }
	  });
	}
 });
 
 