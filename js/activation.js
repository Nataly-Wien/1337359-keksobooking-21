'use strict';

(() => {
  const {
    NOTICES_NUMBER,
    map,
    mapPins,
    mainPin,
    noticeForm,
    filterForm,
    capacityField,
  } = window.options;

  let {
    isPageActive,
  } = window.options;

  const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
  const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);
  const addressField = noticeForm.querySelector(`input[id="address"]`);

  const toggleElementsStyle = (list, state) => {
    list.forEach((elem) => {
      elem.disabled = state;
    });
  };

  const activatePage = (evt) => {
    if (isPageActive || !(evt.button === 0 || evt.key === `Enter`)) {
      return;
    }

    isPageActive = true;
    if (map.classList.contains(`map--faded`)) {
      map.classList.remove(`map--faded`);
    }

    if (noticeForm.classList.contains(`ad-form--disabled`)) {
      noticeForm.classList.remove(`ad-form--disabled`);
    }

    toggleElementsStyle(noticeFormElements, false);
    toggleElementsStyle(filterFormElements, false);

    addressField.value = window.utils.getPinCoords(mainPin);
    capacityField.options[2].selected = true;

    window.options.noticesList = window.mocks.getNoticesList(NOTICES_NUMBER);
    window.options.noticesList.map((item, index) => {
      item.id = index;
    });

    mapPins.appendChild(window.pins.getPinBlock(window.options.noticesList));
    window.pins.setPinsOffset();
  };

  const deactivatePage = () => {
    isPageActive = false;

    if (!map.classList.contains(`map--faded`)) {
      map.classList.add(`map--faded`);
    }

    if (!noticeForm.classList.contains(`ad-form--disabled`)) {
      noticeForm.classList.add(`ad-form--disabled`);
    }

    toggleElementsStyle(noticeFormElements, true);
    toggleElementsStyle(filterFormElements, true);

    addressField.value = window.utils.getPinCoords(mainPin);
  };

  const setActivationListener = () => {
    mainPin.addEventListener(`mousedown`, activatePage);
    mainPin.addEventListener(`keydown`, activatePage);
  };

  window.activation = {
    setActivationListener,
    deactivatePage,
  };
})();
