/**
 * Модуль для инициализации intl-tel-input
 */
export function initPhoneInput() {
  // Проверяем наличие библиотеки
  if (typeof intlTelInput === 'undefined') {
    console.warn('intl-tel-input is not loaded');
    return;
  }

  // Находим все поля телефона
  const phoneInputs = document.querySelectorAll('input[data-phone-input="true"]');

  if (phoneInputs.length === 0) {
    return;
  }

  phoneInputs.forEach(input => {
    // Валидация ввода только цифр
    // Используем keypress для предотвращения ввода нецифровых символов
    input.addEventListener('keypress', function(e) {
      // Разрешаем только цифры (0-9)
      // Служебные клавиши (Backspace, Delete, Tab, Escape, Enter, стрелки) обрабатываются через keydown/keyup
      const char = String.fromCharCode(e.which || e.keyCode);
      const keyCode = e.which || e.keyCode;
      
      // Разрешаем служебные клавиши (Backspace=8, Tab=9, Enter=13)
      // и комбинации с Ctrl/Cmd (для копирования/вставки)
      if (keyCode >= 8 && keyCode <= 13) {
        return; // Разрешаем служебные клавиши
      }
      
      // Разрешаем только цифры (0-9) или комбинации с Ctrl/Cmd
      if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    });

    // Дополнительная валидация на событие input (на случай вставки через clipboard)
    input.addEventListener('input', function(e) {
      // Получаем текущее значение и оставляем только цифры
      let value = e.target.value.replace(/[^\d]/g, '');
      
      // Если значение содержит нецифровые символы, очищаем их
      if (e.target.value !== value) {
        // Сохраняем позицию курсора
        const cursorPosition = e.target.selectionStart;
        const originalLength = e.target.value.length;
        e.target.value = value;
        
        // Восстанавливаем позицию курсора (с учетом удаленных символов)
        const removedChars = originalLength - value.length;
        const newPosition = Math.max(0, cursorPosition - removedChars);
        e.target.setSelectionRange(newPosition, newPosition);
      }
    });

    // Получаем настройки из data-атрибутов
    const defaultCountry = input.getAttribute('data-default-country') || 'az';
    
    // Предпочитаемые страны (строка через запятую или JSON массив)
    let preferredCountries = ['az', 'ru', 'tr', 'us', 'gb']; // дефолт
    const preferredCountriesAttr = input.getAttribute('data-preferred-countries');
    if (preferredCountriesAttr) {
      try {
        // Пробуем распарсить как JSON
        preferredCountries = JSON.parse(preferredCountriesAttr);
      } catch (e) {
        // Если не JSON, разбиваем по запятой
        preferredCountries = preferredCountriesAttr.split(',').map(c => c.trim()).filter(c => c);
      }
    }

    // Исключенные страны (строка через запятую или JSON массив)
    let excludeCountries = []; // дефолт - нет исключенных стран
    const excludeCountriesAttr = input.getAttribute('data-exclude-countries');
    if (excludeCountriesAttr && excludeCountriesAttr.trim() !== '') {
      try {
        // Пробуем распарсить как JSON
        excludeCountries = JSON.parse(excludeCountriesAttr);
      } catch (e) {
        // Если не JSON, разбиваем по запятой
        excludeCountries = excludeCountriesAttr.split(',').map(c => c.trim()).filter(c => c);
      }
    }

    // Отделять код страны от номера
    const separateDialCode = input.getAttribute('data-separate-dial-code') === 'true' || 
                            input.getAttribute('data-separate-dial-code') === true;

    // Показывать код страны рядом с флагом
    const showSelectedDialCode = input.getAttribute('data-show-selected-dial-code') !== 'false';

    // Национальный режим
    const nationalMode = input.getAttribute('data-national-mode') === 'true' || 
                        input.getAttribute('data-national-mode') === true;

    // Форматировать при вводе
    const formatOnDisplay = input.getAttribute('data-format-on-display') !== 'false';

    // Автоматический placeholder
    const autoPlaceholder = input.getAttribute('data-auto-placeholder') || 'off';

    // Инициализация intl-tel-input
    const itiConfig = {
      initialCountry: defaultCountry,
      preferredCountries: preferredCountries,
      separateDialCode: separateDialCode,
      utilsScript: '', // Не используем utils для уменьшения размера
      nationalMode: nationalMode,
      autoPlaceholder: autoPlaceholder,
      formatOnDisplay: formatOnDisplay,
      customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
        return selectedCountryPlaceholder;
      },
      // Указываем путь к флагам
      flagContainerClass: 'iti__flag-container',
      flagClass: 'iti__flag'
    };

    // Добавляем исключенные страны только если они указаны
    if (excludeCountries.length > 0) {
      itiConfig.excludeCountries = excludeCountries;
    }

    const iti = intlTelInput(input, itiConfig);

    // Управление отображением кода страны рядом с флагом
    const wrapper = input.closest('.form-phone-wrapper');
    if (wrapper) {
      wrapper.classList.add('intl-tel-input-wrapper');
      
      // Функция для получения и отображения кода страны
      const updateDialCodeDisplay = () => {
        const flagContainer = wrapper.querySelector('.iti__flag-container');
        if (!flagContainer) return;
        
        // Получаем текущую выбранную страну
        const selectedCountryData = iti.getSelectedCountryData();
        const dialCode = selectedCountryData ? selectedCountryData.dialCode : '';
        
        // Ищем существующий элемент кода страны
        let dialCodeElement = flagContainer.querySelector('.iti__selected-dial-code');
        
        // Если элемента нет и нужно показывать код, создаем его
        if (!dialCodeElement && showSelectedDialCode && dialCode) {
          dialCodeElement = document.createElement('span');
          dialCodeElement.className = 'iti__selected-dial-code';
          dialCodeElement.textContent = '+' + dialCode;
          
          // Вставляем после флага
          const flag = flagContainer.querySelector('.iti__flag');
          if (flag && flag.parentNode) {
            flag.parentNode.insertBefore(dialCodeElement, flag.nextSibling);
          }
        }
        
        // Обновляем отображение
        if (dialCodeElement) {
          if (showSelectedDialCode && dialCode) {
            dialCodeElement.textContent = '+' + dialCode;
            dialCodeElement.style.display = '';
            dialCodeElement.style.visibility = 'visible';
          } else {
            dialCodeElement.style.display = 'none';
            dialCodeElement.style.visibility = 'hidden';
          }
        }
      };
      
      // Обновляем отображение после инициализации (с небольшой задержкой для создания DOM)
      setTimeout(updateDialCodeDisplay, 100);
      
      // Обработка изменения страны для обновления отображения кода
      input.addEventListener('countrychange', function() {
        setTimeout(updateDialCodeDisplay, 0);
      });
    }

    // Обработка валидации
    input.addEventListener('blur', function() {
      if (iti.isValidNumber()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (wrapper) {
          wrapper.classList.remove('is-invalid');
        }
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (wrapper) {
          wrapper.classList.add('is-invalid');
        }
      }
    });

    // Обработка валидации при изменении страны (уже обрабатывается выше в countrychange)

    // Сохраняем экземпляр для доступа извне
    input.intlTelInputInstance = iti;
  });
}
