'use strict';

const MAIN_PIN_WIDTH = 65;
const MAIN_PIN_HEIGHT = 65;
const MAIN_PIN_TALE = 16;
const mainPinTotalHeight = MAIN_PIN_HEIGHT + MAIN_PIN_TALE;

const mainPin = document.querySelector(`.map__pin--main`);
const addressField = document.querySelector(`input[id="address"]`);

let isPageActive = false;

const getPinCoords = (element) => {
  const currentY = isPageActive ? mainPinTotalHeight : Math.round(MAIN_PIN_HEIGHT / 2);
  const x = parseInt(element.style.left, 10) + Math.round(MAIN_PIN_WIDTH / 2);
  const y = parseInt(element.style.top, 10) + currentY;

  return `${x}, ${y}`;
};

const onSuccess = (dataList) => {
  const noticesList = window.utils.addIdToData(dataList);
  window.pins.noticesList = noticesList;
  window.pins.showPins(window.filters.getFilteredList(noticesList));
  window.forms.enableFilterForm();
};

const activatePage = () => {
  if (isPageActive) {
    return;
  }

  isPageActive = true;
  window.forms.enableNoticeForm();
  addressField.value = getPinCoords(mainPin);

  window.backend.load(onSuccess, window.messages.showError);
};

const onMainPinMousedown = (evt) => {
  if (evt.button === 0) {
    activatePage();
  }
};
const onMainPinKeydown = (evt) => {
  if (evt.key === window.utils.Key.ENTER) {
    activatePage();
  }
};

const deactivatePage = () => {
  isPageActive = false;
  window.forms.disableForms();
  addressField.value = getPinCoords(mainPin);
};

const setActivationListener = () => {
  mainPin.addEventListener(`mousedown`, onMainPinMousedown);
  mainPin.addEventListener(`keydown`, onMainPinKeydown);
};

window.activation = {
  setActivationListener,
  deactivatePage,
  getPinCoords,
  MAIN_PIN_WIDTH,
  mainPinTotalHeight,
};
