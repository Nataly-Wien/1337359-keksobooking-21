'use strict';

(() => {
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

  const getPinCoords = (element) => {
    const elemStyle = window.getComputedStyle(element);
    const currentY = window.options.isPageActive
      ? parseInt(elemStyle.height, 10)
      : Math.round(parseInt(elemStyle.height, 10) / 2);
    const x = parseInt(element.style.left, 10) + Math.round(parseInt(elemStyle.width, 10) / 2);
    const y = parseInt(element.style.top, 10) + currentY;

    return `${x}, ${y}`;
  };

  window.utils = {
    getRandomInRange,
    getRandomFromList,
    getRandomArrayFromList,
    getRandomPhotosArray,
    getWordForm,
    getPinCoords,
  };
})();
