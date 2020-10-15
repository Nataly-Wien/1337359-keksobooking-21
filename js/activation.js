'use strict';

(() => {
  const {
    map,
    mainPin,
    noticeForm,
    filterForm,
  } = window.options;

  const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
  const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);
  const addressField = noticeForm.querySelector(`input[id="address"]`);

  const toggleElementsStyle = (list, state) => {
    list.forEach((elem) => {
      elem.disabled = state;
    });
  };

  const onMainPinClick = (evt) => {
    if (window.options.isPageActive || !(evt.button === 0 || evt.key === `Enter`)) {
      return;
    }

    window.options.isPageActive = true;
    map.classList.remove(`map--faded`);
    noticeForm.classList.remove(`ad-form--disabled`);

    toggleElementsStyle(noticeFormElements, false);
    toggleElementsStyle(filterFormElements, false);

    addressField.value = window.utils.getPinCoords(mainPin);
    document.querySelector(`select[id="capacity"]`).selectedIndex = 2;

    window.options.noticesList = window.mocks.getNoticesList();
    window.options.noticesList.map((item, index) => {
      item.id = index;
    });

    window.pins.showPins();
  };

  const deactivatePage = () => {
    window.options.isPageActive = false;

    map.classList.add(`map--faded`);

    noticeForm.classList.add(`ad-form--disabled`);

    toggleElementsStyle(noticeFormElements, true);
    toggleElementsStyle(filterFormElements, true);

    addressField.value = window.utils.getPinCoords(mainPin);
  };

  const setActivationListener = () => {
    mainPin.addEventListener(`mousedown`, onMainPinClick);
    mainPin.addEventListener(`keydown`, onMainPinClick);
  };

  window.activation = {
    setActivationListener,
    deactivatePage,
  };
})();
