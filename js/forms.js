'use strict';

const DEFAULT_IMAGE = `img/muffin-grey.svg`;
const IMAGE_ERROR_MESSAGE = `Ошибка загрузки файла`;

const map = document.querySelector(`.map`);
const filterForm = map.querySelector(`.map__filters`);
const noticeForm = document.querySelector(`.ad-form`);

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
  window.validation.resetPlaceholder();
  filterForm.reset();
  avatarPreview.src = DEFAULT_IMAGE;
  photoPreview.style.backgroundImage = `none`;
  window.movePin.returnPinToStart();
  window.activation.deactivatePage();
};

const onSuccess = () => {
  resetToInitial();
  window.messages.showMessage(successMessage);
};

const onError = () => {
  window.messages.showMessage(errorMessage);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (window.validation.onCapacityFieldCheck(evt)) {
    const data = new FormData(noticeForm);
    window.backend.save(data, onSuccess, onError);
  }
};

const fileUpload = (evt, imgContainer) => {
  const file = evt.target.files[0];

  if (!window.validation.isImageFileValid(file)) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener(`load`, () => {
    if (imgContainer.tagName === `IMG`) {
      imgContainer.src = reader.result;
    } else {
      imgContainer.style.backgroundImage = `url(${reader.result})`;
    }
  });

  reader.addEventListener(`error`, () => {
    window.messages.showError(IMAGE_ERROR_MESSAGE);
  });

  reader.readAsDataURL(file);

};

noticeForm.addEventListener(`submit`, onFormSubmit);
resetButton.addEventListener(`click`, resetToInitial);

avatarInput.addEventListener(`change`, (evt) => fileUpload(evt, avatarPreview));
photoInput.addEventListener(`change`, (evt) => fileUpload(evt, photoPreview));

window.forms = {
  enableNoticeForm,
  enableFilterForm,
  disableForms,
};
