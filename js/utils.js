'use strict';

const getWordForm = (number, forms) => {
  const cases = [2, 0, 1, 1, 1, 2];
  number = Math.floor(Math.abs(number)) % 100;

  return forms[number > 4 && number < 20 ? 2 : cases[Math.min(number % 10, 5)]];
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
  getWordForm,
  addIdToData,
  debounce,
};
