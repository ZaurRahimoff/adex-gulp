/**
 * Модуль для управления воспроизведением видео
 */
export function initVideoPlay() {
  const videoPlayButtons = document.querySelectorAll('.hero__play-btn, .video-section__play-btn');
  
  videoPlayButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
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
