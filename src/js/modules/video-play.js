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
          const separator = src.includes('?') ? '&' : '?';
          iframe.src = src + separator + 'autoplay=1&mute=1';
          iframe.style.display = 'block';
          iframe.style.zIndex = '3';
          this.style.display = 'none';
          
          const videoImage = videoWrapper.querySelector('.hero__video-image');
          if (videoImage) {
            videoImage.style.display = 'none';
          }
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
