'use strict';
(() => {
  const map = document.querySelector(`.map`);
  const filterForm = map.querySelector(`.map__filters`);
  const noticeForm = document.querySelector(`.ad-form`);
  const addressField = noticeForm.querySelector(`input[id="address"]`);

  const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
  const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);

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

  window.forms = {
    map,
    addressField,
    enableForms,
    disableForms,
  };
})();