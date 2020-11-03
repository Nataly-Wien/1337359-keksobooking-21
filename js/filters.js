'use strict';

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

const getFilteredList = (list) => {
  const results = [];

  for (let i = 0; results.length < NOTICES_NUMBER && i < list.length; i++) {
    if (isType(list[i].offer.type) && isPrice(list[i].offer.price) && isRooms(list[i].offer.rooms) &&
      isGuests(list[i].offer.guests) && isFeatures(list[i].offer.features)) {
      results.push(list[i]);
    }
  }

  return results;
};

const onFormChange = () => window.pins.showPins(getFilteredList(window.pins.noticesList));

const setFiltersListener = () => {
  filterForm.addEventListener(`change`, window.utils.debounce(onFormChange));
};

window.filters = {
  setFiltersListener,
  getFilteredList,
};
