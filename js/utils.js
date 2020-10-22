'use strict';

(() => {
  const LOCATION_Y_MIN = 130;
  const LOCATION_Y_MAX = 630;
  const LOCATION_X_MIN = 0;
  const locationXMax = document.querySelector(`.map__pins`).clientWidth;

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
    const errorBlock = document.createElement(`div`);
    errorBlock.textContent = message;
    errorBlock.classList.add(`error-message`);
    document.querySelector(`.map__pins`).insertAdjacentElement('afterbegin', errorBlock);
  };

  window.utils = {
    getRandomInRange,
    getRandomFromList,
    getRandomArrayFromList,
    getRandomPhotosArray,
    getWordForm,
    showError,
    LOCATION_X_MIN,
    locationXMax,
    LOCATION_Y_MIN,
    LOCATION_Y_MAX,
    isPageActive,
  };
})();
