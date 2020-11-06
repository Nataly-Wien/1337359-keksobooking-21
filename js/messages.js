'use strict';

const main = document.querySelector(`main`);
const mapPins = document.querySelector(`.map__pins`);
const noticeForm = document.querySelector(`.ad-form`);
const resetButton = noticeForm.querySelector(`.ad-form__reset`);

const showMessage = (messageBlock) => {
  const closeMessage = () => {
    document.removeEventListener(`click`, onDocumentClick);
    document.removeEventListener(`keydown`, onDocumentKeydown);
    main.removeChild(messageBlock);
  };

  const onDocumentClick = () => closeMessage();
  const onDocumentKeydown = (evt) => {
    if (evt.key === window.utils.Key.ESCAPE) {
      closeMessage();
    }
  };

  main.insertAdjacentElement(`afterbegin`, messageBlock);
  document.addEventListener(`click`, onDocumentClick);
  document.addEventListener(`keydown`, onDocumentKeydown);

  const errorButton = messageBlock.querySelector(`.error__button`);
  if (errorButton) {
    errorButton.addEventListener(`click`, closeMessage);
  }
};

const showError = (message) => {
  const removeError = () => {
    document.removeEventListener(`keydown`, onKeydown);
    errorBlock.removeEventListener(`click`, onMessageClick);
    noticeForm.removeEventListener(`input`, onFormInput);
    noticeForm.removeEventListener(`submit`, onFormSubmit);
    resetButton.removeEventListener(`click`, onResetClick);
    mapPins.removeChild(errorBlock);
  };

  const onMessageClick = () => removeError();
  const onFormInput = () => removeError();
  const onFormSubmit = () => removeError();
  const onResetClick = () => removeError();
  const onKeydown = (evt) => {
    if (evt.key === window.utils.Key.ESCAPE) {
      removeError();
    }
  };

  const errorBlock = document.createElement(`div`);

  errorBlock.textContent = message;
  errorBlock.classList.add(`error-message`);
  mapPins.insertAdjacentElement(`afterbegin`, errorBlock);
  document.addEventListener(`keydown`, onKeydown);
  errorBlock.addEventListener(`click`, onMessageClick);
  noticeForm.addEventListener(`input`, onFormInput);
  noticeForm.addEventListener(`submit`, onFormSubmit);
  resetButton.addEventListener(`click`, onResetClick);
};

window.messages = {
  showError,
  showMessage,
};
