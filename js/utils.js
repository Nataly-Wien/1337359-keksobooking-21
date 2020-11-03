'use strict';

const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;
const LOCATION_X_MIN = 0;

const mapPins = document.querySelector(`.map__pins`);
const locationXMax = mapPins.clientWidth;

let isPageActive = false;

const getRandomInRange = (max, min = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFromList = (list) => list[getRandomInRange(list.length - 1, 0)];

const getRandomArrayFromList = (list) => list.filter((item) => item && Math.random() > 0.5);

const getRandomPhotosArray = (max, path) => {
  const arr = [];

  for (let i = 1; i <= getRandomInRange(max); i++) {
    arr.push(path.replace(`hotel1`, `hotel${i}`));
  }

  return arr;
};

const getWordForm = (number, forms) => {
  const cases = [2, 0, 1, 1, 1, 2];
  number = Math.floor(Math.abs(number)) % 100;

  return forms[number > 4 && number < 20 ? 2 : cases[Math.min(number % 10, 5)]];
};

const showError = (message) => {
  const noticeForm = document.querySelector(`.ad-form`);
  const resetButton = noticeForm.querySelector(`.ad-form__reset`);

  const removeError = () => {
    document.removeEventListener(`keydown`, onKeydown);
    errorBlock.removeEventListener(`click`, onMessageClick);
    noticeForm.removeEventListener(`input`, onFormInput);
    noticeForm.removeEventListener(`submit`, onFormSubmit);
    resetButton.removeEventListener(`click`, onResetClick);
    mapPins.removeChild(errorBlock);
  };

  const onKeydown = (evt) => {
    if (evt.key === `Escape`) {
      removeError();
    }
  };

  const onMessageClick = () => removeError();
  const onFormInput = () => removeError();
  const onFormSubmit = () => removeError();
  const onResetClick = () => removeError();

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

const addIdToData = (dataArray) => dataArray.map((item, index) => Object.assign({}, item, {
  id: index
}));

const debounce = (fn, timeout = 500) => {
  let lastTimeout = null;

  return function (...args) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    const functionCall = function () {
      return fn(...args);
    };

    lastTimeout = setTimeout(functionCall, timeout);
  };
};

window.utils = {
  getRandomInRange,
  getRandomFromList,
  getRandomArrayFromList,
  getRandomPhotosArray,
  getWordForm,
  showError,
  addIdToData,
  debounce,
  LOCATION_X_MIN,
  locationXMax,
  LOCATION_Y_MIN,
  LOCATION_Y_MAX,
  isPageActive,
};
