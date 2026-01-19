/**
 * Load More Events Programme Module
 * Управляет функциональностью "Show all" / "Show less" для страницы events-programme
 * Работает с элементами внутри каждого таба отдельно
 */

export function initLoadMoreEventsProgramme() {
  // Находим все табы с контентом
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabPanes.length === 0) {
    console.log('[Load More Events] Нет табов .tab-pane');
    return;
  }

  console.log(`[Load More Events] Найдено табов: ${tabPanes.length}`);

  // Обрабатываем каждый таб отдельно
  tabPanes.forEach((tabPane, tabIndex) => {
    // Находим кнопку внутри этого таба
    const showAllBtn = tabPane.querySelector('.ep__show-all-btn');
    
    if (!showAllBtn) {
      console.log(`[Load More Events] Таб ${tabIndex}: кнопка не найдена`);
      return;
    }

    // Находим все элементы для управления: события, спикеры, секции
    const allItems = [];
    
    // Собираем все .ep__event-item
    const eventItems = Array.from(tabPane.querySelectorAll('.ep__event-item'));
    allItems.push(...eventItems);
    
    // Собираем все .ep__participant-card
    const participantCards = Array.from(tabPane.querySelectorAll('.ep__participant-card'));
    allItems.push(...participantCards);
    
    // Собираем все .row с .ep__section-label
    const sectionRows = Array.from(tabPane.querySelectorAll('.row')).filter(row => 
      row.querySelector('.ep__section-label')
    );
    allItems.push(...sectionRows);

    console.log(`[Load More Events] Таб ${tabIndex}: найдено ${allItems.length} элементов (события: ${eventItems.length}, спикеры: ${participantCards.length}, секции: ${sectionRows.length})`);

    // Если элементов меньше или равно 10, скрываем кнопку
    if (allItems.length <= 10) {
      console.log(`[Load More Events] Таб ${tabIndex}: элементов ${allItems.length} <= 10, кнопка скрыта`);
      showAllBtn.style.display = 'none';
      return;
    }

    // Добавляем иконку к кнопке
    const icon = document.createElement('i');
    icon.className = 'fas fa-chevron-down ms-2';
    showAllBtn.appendChild(icon);

    // Функция для скрытия элементов после индекса
    function hideItemsAfterIndex(items, startIndex) {
      items.forEach((item, index) => {
        if (index >= startIndex) {
          item.style.display = 'none';
          item.setAttribute('data-hidden', 'true');
        }
      });
    }

    // Функция для показа всех элементов
    function showAllItems(items) {
      items.forEach(item => {
        item.style.display = '';
        item.removeAttribute('data-hidden');
      });
    }

    // Инициализация: скрываем элементы после 10-го
    hideItemsAfterIndex(allItems, 10);
    console.log(`[Load More Events] Таб ${tabIndex}: скрыто ${Math.max(0, allItems.length - 10)} элементов`);

    // Обработчик клика
    let isExpanded = false;

    showAllBtn.addEventListener('click', function() {
      console.log(`[Load More Events] Клик на кнопку, isExpanded: ${isExpanded}`);
      if (!isExpanded) {
        // Показываем все элементы
        showAllItems(allItems);
        showAllBtn.childNodes[0].nodeValue = 'Show less';
        icon.className = 'fas fa-chevron-up ms-2';
        isExpanded = true;
        console.log('[Load More Events] Показаны все элементы');
      } else {
        // Скрываем элементы после 10-го
        hideItemsAfterIndex(allItems, 10);
        showAllBtn.childNodes[0].nodeValue = 'Show all';
        icon.className = 'fas fa-chevron-down ms-2';
        isExpanded = false;
        console.log('[Load More Events] Элементы скрыты');

        // Прокручиваем к началу списка
        const firstVisibleItem = allItems[0];
        if (firstVisibleItem) {
          firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
