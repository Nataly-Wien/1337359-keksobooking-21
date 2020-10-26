'use strict';
(() => {
  const map = document.querySelector(`.map`);
  const filterForm = map.querySelector(`.map__filters`);
  const noticeForm = document.querySelector(`.ad-form`);
  const main = document.querySelector(`main`);

  const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
  const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);

  const successMessage = document.querySelector(`#success`).content.querySelector(`.success`);
  const errorMessage = document.querySelector(`#error`).content.querySelector(`.error`);

  const resetButton = noticeForm.querySelector(`.ad-form__reset`);

  const toggleElementsStyle = (list, state) => {
    list.forEach((elem) => {
      elem.disabled = state;
    });
  };

  const enableForms = () => {
    map.classList.remove(`map--faded`);
    noticeForm.classList.remove(`ad-form--disabled`);

    toggleElementsStyle(noticeFormElements, false);
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
    window.movePin.returnPinToStart();
    window.activation.deactivatePage();
  };

  const showMessage = (message) => {
    const closeMessage = () => {
      window.removeEventListener(`keydown`, onKeyDown);
      window.removeEventListener(`click`, closeMessage);
      main.removeChild(message);
    };

    const onKeyDown = (evt) => {
      if (evt.code === `Escape`) {
        evt.preventDefault();
        closeMessage();
      }
    };

    main.insertAdjacentElement(`afterbegin`, message);
    window.addEventListener(`click`, closeMessage);
    window.addEventListener(`keydown`, onKeyDown);

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

  noticeForm.addEventListener(`submit`, onFormSubmit);
  resetButton.addEventListener(`click`, resetToInitial);

  window.forms = {
    enableForms,
    disableForms,
  };
})();
