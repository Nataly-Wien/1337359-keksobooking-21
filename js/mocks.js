'use strict';

(() => {
  const MAX_RANDOM = 10;
  const MAX_ROOMS_NUMBER = 3;
  const MAX_GUESTS_NUMBER = 3;
  const MAX_PHOTOS_NUMBER = 3;
  const PRICE_FACTOR = 1000;

  const CHECK_IN = 12;
  const CHECK_OUT = 14;
  const LOCATION_Y_MIN = 130;
  const LOCATION_Y_MAX = 630;
  const LOCATION_X_MIN = 0;
  const PHOTOS_PATH = `http://o0.github.io/assets/images/tokyo/hotel1.jpg`;

  const TYPE_LIST = [
    `palace`,
    `flat`,
    `house`,
    `bungalow`
  ];

  const FEATURES_LIST = [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`
  ];

  const locationXMax = window.options.mapPins.clientWidth;

  const getNoticesList = (number) => {
    const notices = [];

    for (let i = 1; i <= number; i++) {
      const locX = window.utils.getRandomInRange(locationXMax, LOCATION_X_MIN);
      const locY = window.utils.getRandomInRange(LOCATION_Y_MAX, LOCATION_Y_MIN);
      notices.push({
        author: {
          avatar: `img/avatars/user0${i}.png`,
        },
        location: {
          x: locX,
          y: locY,
        },
        offer: {
          title: `Заголовок предложения ${i}`,
          address: `${locX}, ${locY}`,
          price: window.utils.getRandomInRange(MAX_RANDOM) * PRICE_FACTOR,
          type: window.utils.getRandomFromList(TYPE_LIST),
          rooms: window.utils.getRandomInRange(MAX_ROOMS_NUMBER),
          guests: window.utils.getRandomInRange(MAX_GUESTS_NUMBER),
          checkin: `${window.utils.getRandomInRange(CHECK_OUT, CHECK_IN)}:00`,
          checkout: `${window.utils.getRandomInRange(CHECK_OUT, CHECK_IN)}:00`,
          features: window.utils.getRandomArrayFromList(FEATURES_LIST),
          description: `строка с описанием `.repeat(window.utils.getRandomInRange(MAX_RANDOM)),
          photos: window.utils.getRandomPhotosArray(MAX_PHOTOS_NUMBER, PHOTOS_PATH),
        }
      });
    }

    return notices;
  };

  window.mocks = {
    getNoticesList,
  };
})();
