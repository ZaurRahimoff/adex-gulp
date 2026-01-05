/**
 * Модуль для управления вкладками программы мероприятия
 */
export function initEventProgramTabs() {
  const eventProgramTabs = document.querySelectorAll('.event-program-section__tab');
  
  if (eventProgramTabs.length > 0) {
    eventProgramTabs.forEach(tab => {
      tab.addEventListener('click', function() {
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
