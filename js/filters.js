'use strict';

(() => {
  const NOTICES_NUMBER = 5;
  const Price = {
    MIN: 0,
    MIDDLE: 10000,
    HIGH: 50000,
    MAX: Infinity,
  };

  const checkboxFieldset = document.querySelector(`#housing-features`);
  const checkboxes = Array.from(checkboxFieldset.querySelectorAll(`input`));
  const filters = document.querySelectorAll(`.map__filters select`);

  const getFilter = () => {
    const filter = {
      type: filters[0].value,
      rooms: filters[2].value,
      guests: filters[3].value,
      features: [],
    };

    switch (filters[1].value) {
      case `any`:
        filter.priceMin = Price.MIN;
        filter.priceMax = Price.MAX;
        break;
      case `low`:
        filter.priceMin = Price.MIN;
        filter.priceMax = Price.MIDDLE - 1;
        break;
      case `middle`:
        filter.priceMin = Price.MIDDLE;
        filter.priceMax = Price.HIGH;
        break;
      case `high`:
        filter.priceMin = Price.HIGH + 1;
        filter.priceMax = Price.MAX;
        break;
    }

    checkboxes.forEach((input) => {
      if ((input.checked)) {
        filter.features.push(input.value);
      }
    });

    return filter;
  };

  const compare = (notice, filter) => {
    const {
      offer: {
        type,
        price,
        rooms,
        guests,
        features,
      }
    } = notice;

    const isType = filter.type === `any` || filter.type === type;
    const isPrice = price >= filter.priceMin && price <= filter.priceMax;
    const isRooms = filter.rooms === `any` || +filter.rooms === rooms;
    const isGuests = filter.guests === `any` || +filter.guests === guests;
    const isFeatures = filter.features.every((feature) => features.includes(feature));

    return isType && isPrice && isRooms && isGuests && isFeatures;
  };

  const getFilteredList = (noticesList) => noticesList.filter((item) => compare(item, getFilter())).slice(0, NOTICES_NUMBER);

  const onFormChange = () => {
    window.pins.removePins();
    window.card.closeCard();
    window.pins.showPins(getFilteredList(window.pins.noticesList));
  };

  const setFiltersListener = () => {
    filters.forEach((select) => {
      select.addEventListener(`change`, onFormChange);
    });
    checkboxFieldset.addEventListener(`click`, onFormChange);
  };

  window.filters = {
    setFiltersListener,
    getFilteredList,
  };
})();
