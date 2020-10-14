'use strict';

(() => {
  const NOTICES_NUMBER = 8;

  const map = document.querySelector(`.map`);
  const mapPins = map.querySelector(`.map__pins`);
  const mainPin = map.querySelector(`.map__pin--main`);
  const noticeForm = document.querySelector(`.ad-form`);
  const filterForm = map.querySelector(`.map__filters`);
  const capacityField = document.querySelector(`select[id="capacity"]`);

  let noticesList = [];
  let isPageActive = false;

  window.options = {
    NOTICES_NUMBER,
    map,
    mapPins,
    mainPin,
    isPageActive,
    noticesList,
    noticeForm,
    filterForm,
    capacityField,
  };
})();
