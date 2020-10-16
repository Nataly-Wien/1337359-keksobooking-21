'use strict';

(() => {
  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_HEIGHT = 65;
  const MAIN_PIN_TALE = 22;
  const mainPinTotalHeight = MAIN_PIN_HEIGHT + MAIN_PIN_TALE;

  const mainPin = document.querySelector(`.map__pin--main`);

  const getPinCoords = (element) => {
    const currentY = window.utils.isPageActive ? mainPinTotalHeight : Math.round(MAIN_PIN_HEIGHT / 2);
    const x = parseInt(element.style.left, 10) + Math.round(MAIN_PIN_WIDTH / 2);
    const y = parseInt(element.style.top, 10) + currentY;

    return `${x}, ${y}`;
  };

  const onMainPinClick = (evt) => {
    if (window.utils.isPageActive || !(evt.button === 0 || evt.key === `Enter`)) {
      return;
    }

    evt.stopImmediatePropagation();
    window.utils.isPageActive = true;

    window.forms.enableForms();
    window.forms.addressField.value = getPinCoords(mainPin);
    document.querySelector(`select[id="capacity"]`).selectedIndex = 2;

    window.pins.noticesList = window.mocks.getNoticesList();
    window.pins.noticesList.map((item, index) => {
      item.id = index;
    });
    window.pins.showPins();
  };

  const deactivatePage = () => {
    window.utils.isPageActive = false;
    window.forms.disableForms();
    window.forms.addressField.value = getPinCoords(mainPin);
  };

  const setActivationListener = () => {
    mainPin.addEventListener(`mousedown`, onMainPinClick);
    mainPin.addEventListener(`keydown`, onMainPinClick);
  };

  window.activation = {
    setActivationListener,
    deactivatePage,
    getPinCoords,
    MAIN_PIN_WIDTH,
    mainPinTotalHeight,
  };
})();
