'use strict';

(() => {
  const map = document.querySelector(`.map`);
  const mapPins = map.querySelector(`.map__pins`);
  const mainPin = map.querySelector(`.map__pin--main`);
  const noticeForm = document.querySelector(`.ad-form`);
  const filterForm = map.querySelector(`.map__filters`);

  let noticesList = [];
  let isPageActive = false;

  window.options = {
    map,
    mapPins,
    mainPin,
    isPageActive,
    noticesList,
    noticeForm,
    filterForm,
  };
})();
