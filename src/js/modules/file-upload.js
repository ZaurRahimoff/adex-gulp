/**
 * Модуль для обработки загрузки файлов
 */
export function initFileUpload() {
  // Находим все кнопки загрузки файлов
  const fileButtons = document.querySelectorAll('button[data-file-input]');

  fileButtons.forEach(button => {
    const inputId = button.getAttribute('data-file-input');
    const fileInput = document.getElementById(inputId);
    const displayInput = document.getElementById(`${inputId}_display`);

    if (!fileInput || !displayInput) {
      return;
    }

    // Обработчик клика на кнопку
    button.addEventListener('click', function(e) {
      e.preventDefault();
      fileInput.click();
    });

    // Обработчик изменения файла
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        displayInput.value = file.name;
      } else {
        displayInput.value = '';
      }
    });

    // Обработчик клика на поле display для открытия диалога
    displayInput.addEventListener('click', function() {
      fileInput.click();
    });
  });
}
