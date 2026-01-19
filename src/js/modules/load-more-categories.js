/**
 * Load More Categories Module
 * Управляет функциональностью "Show all" / "Show less" для страницы categories
 * Работает с элементами аккордеона категорий
 */

export function initLoadMoreCategories() {
  // Проверяем, что мы на странице categories (по наличию специфичного аккордеона)
  const categoriesPage = document.querySelector('.categories-page');
  
  if (!categoriesPage) {
    return;
  }

  // Находим кнопку
  const showAllBtn = categoriesPage.querySelector('.ep__show-all-btn');
  
  if (!showAllBtn) {
    return;
  }

  // Находим контейнер с аккордеоном
  const accordion = document.querySelector('#categoriesAccordion');
  
  if (!accordion) {
    return;
  }

  // Находим все элементы аккордеона
  const accordionItems = Array.from(accordion.querySelectorAll('.accordion-item'));

  if (accordionItems.length === 0) {
    return;
  }

  // Если элементов меньше или равно 10, скрываем кнопку
  if (accordionItems.length <= 10) {
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
  hideItemsAfterIndex(accordionItems, 10);

  // Обработчик клика
  let isExpanded = false;

  showAllBtn.addEventListener('click', function() {
    if (!isExpanded) {
      // Показываем все элементы
      showAllItems(accordionItems);
      showAllBtn.childNodes[0].nodeValue = 'Show less';
      icon.className = 'fas fa-chevron-up ms-2';
      isExpanded = true;
    } else {
      // Скрываем элементы после 10-го
      hideItemsAfterIndex(accordionItems, 10);
      showAllBtn.childNodes[0].nodeValue = 'Show all';
      icon.className = 'fas fa-chevron-down ms-2';
      isExpanded = false;

      // Прокручиваем к началу списка
      const firstVisibleItem = accordionItems[0];
      if (firstVisibleItem) {
        firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}
