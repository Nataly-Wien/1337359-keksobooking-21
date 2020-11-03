'use strict';

const IMAGE_TYPES = [`image/gif`, `image/jpeg`, `image/png`];
const DEFAULT_IMAGE = `img/muffin-grey.svg`;
const IMAGE_MAX_SIZE = 512000;
const IMAGE_ERROR_MESSAGES = [
  `Максимальный размер файла - 500 Кб`,
  `Неверный тип файла изображения`,
  `Ошибка загрузки файла`,
];

const map = document.querySelector(`.map`);
const filterForm = map.querySelector(`.map__filters`);
const noticeForm = document.querySelector(`.ad-form`);
const main = document.querySelector(`main`);

const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);

const successMessage = document.querySelector(`#success`).content.querySelector(`.success`);
const errorMessage = document.querySelector(`#error`).content.querySelector(`.error`);

const resetButton = noticeForm.querySelector(`.ad-form__reset`);

const avatarInput = noticeForm.querySelector(`#avatar`);
const avatarPreview = noticeForm.querySelector(`.ad-form-header__preview img`);
const photoInput = noticeForm.querySelector(`#images`);
const photoPreview = noticeForm.querySelector(`.ad-form__photo`);

const toggleElementsStyle = (list, state) => {
  list.forEach((element) => {
    element.disabled = state;
  });
};

const enableNoticeForm = () => {
  map.classList.remove(`map--faded`);
  noticeForm.classList.remove(`ad-form--disabled`);
  toggleElementsStyle(noticeFormElements, false);
};

const enableFilterForm = () => {
  toggleElementsStyle(filterFormElements, false);
};

const disableForms = () => {
  map.classList.add(`map--faded`);
  noticeForm.classList.add(`ad-form--disabled`);

  toggleElementsStyle(noticeFormElements, true);
  toggleElementsStyle(filterFormElements, true);
};

const resetToInitial = (evt) => {
  if (evt) {
    evt.preventDefault();
  }

  window.card.closeCard();
  window.pins.removePins();
  noticeForm.reset();
  filterForm.reset();
  avatarPreview.src = DEFAULT_IMAGE;
  photoPreview.style.backgroundImage = `none`;
  window.movePin.returnPinToStart();
  window.activation.deactivatePage();
};

const showMessage = (message) => {
  const closeMessage = () => {
    document.removeEventListener(`click`, onDocumentClick);
    document.removeEventListener(`keydown`, onDocumentKeydown);
    main.removeChild(message);
  };

  const onDocumentClick = () => closeMessage();

  const onDocumentKeydown = (evt) => {
    if (evt.key === `Escape`) {
      closeMessage();
    }
  };

  main.insertAdjacentElement(`afterbegin`, message);
  document.addEventListener(`click`, onDocumentClick);
  document.addEventListener(`keydown`, onDocumentKeydown);

  const errorButton = message.querySelector(`.error__button`);
  if (errorButton) {
    errorButton.addEventListener(`click`, closeMessage);
  }
};

const onSuccess = () => {
  resetToInitial();
  showMessage(successMessage);
};

const onError = () => {
  showMessage(errorMessage);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (window.validation.onCapacityFieldCheck(evt)) {
    const data = new FormData(noticeForm);
    window.backend.save(data, onSuccess, onError);
  }
};

const onFileInputChange = (imgContainer) => (evt) => {
  const file = evt.target.files[0];

  const isTypeMatch = () => IMAGE_TYPES.some((item) => file.type === item);
  const isSizeMatch = () => file.size <= IMAGE_MAX_SIZE;

  if (!isSizeMatch()) {
    window.utils.showError(IMAGE_ERROR_MESSAGES[0]);
  } else if (!isTypeMatch()) {
    window.utils.showError(IMAGE_ERROR_MESSAGES[1]);
  } else {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (imgContainer.tagName === `IMG`) {
        imgContainer.src = reader.result;
      } else {
        imgContainer.style.backgroundImage = `url(${reader.result})`;
      }
    });

    reader.addEventListener(`error`, () => {
      window.utils.showError(IMAGE_ERROR_MESSAGES[2]);
    });

    reader.readAsDataURL(file);
  }
};


noticeForm.addEventListener(`submit`, onFormSubmit);
resetButton.addEventListener(`click`, resetToInitial);

avatarInput.addEventListener(`change`, onFileInputChange(avatarPreview));
photoInput.addEventListener(`change`, onFileInputChange(photoPreview));

window.forms = {
  enableNoticeForm,
  enableFilterForm,
  disableForms,
};
