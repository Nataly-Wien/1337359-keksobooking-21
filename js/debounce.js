'use strict';

(() => {
  const TIMEOUT = 500;

  const debounce = (fn) => {
    let lastTimeout = null;

    return function (...args) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      const functionCall = function () {
        return fn(...args);
      };

      lastTimeout = setTimeout(functionCall, TIMEOUT);
    };
  };

  window.debounce = {
    debounce,
  };

})();
