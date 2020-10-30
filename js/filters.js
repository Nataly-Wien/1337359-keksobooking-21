'use strict';

(() => {
  const NOTICES_NUMBER = 5;
  const ANY_VALUE = `any`;

  const Price = {
    MIN: 0,
    MIDDLE: 10000,
    HIGH: 50000,
    MAX: Infinity,
  };

  const PRICE = {
    any: {
      min: Price.MIN,
      max: Price.MAX,
    },
    low: {
      min: Price.MIN,
      max: Price.MIDDLE - 1,
    },
    middle: {
      min: Price.MIDDLE,
      max: Price.HIGH,
    },
    high: {
      min: Price.HIGH + 1,
      max: Price.MAX,
    },
  };

  const filterForm = document.querySelector(`.map__filters`);
  const typeFilter = filterForm.querySelector(`#housing-type`);
  const priceFilter = filterForm.querySelector(`#housing-price`);
  const roomsFilter = filterForm.querySelector(`#housing-rooms`);
  const guestsFilter = filterForm.querySelector(`#housing-guests`);

  const isType = (type) => typeFilter.value === ANY_VALUE || typeFilter.value === type;
  const isPrice = (price) => price >= PRICE[priceFilter.value].min && price <= PRICE[priceFilter.value].max;
  const isRooms = (rooms) => roomsFilter.value === ANY_VALUE || +roomsFilter.value === rooms;
  const isGuests = (guests) => guestsFilter.value === ANY_VALUE || +guestsFilter.value === guests;
  const isFeatures = (features) => {
    const checkboxes = Array.from(filterForm.querySelectorAll(`input[type="checkbox"]:checked`));

    return checkboxes.every((feature) => features.includes(feature.value));
  };

  const getFilteredList = (arr) => {
    const result = [];

    for (let i = 0; result.length < NOTICES_NUMBER && i < arr.length; i++) {
      if (isType(arr[i].offer.type) && isPrice(arr[i].offer.price) && isRooms(arr[i].offer.rooms) &&
        isGuests(arr[i].offer.guests) && isFeatures(arr[i].offer.features)) {
        result.push(arr[i]);
      }
    }

    return result;
  };

  const onFormChange = () => window.pins.showPins(getFilteredList(window.pins.noticesList));

  const setFiltersListener = () => {
    filterForm.addEventListener(`change`, window.debounce.debounce(onFormChange));
  };

  window.filters = {
    setFiltersListener,
    getFilteredList,
  };
})();
