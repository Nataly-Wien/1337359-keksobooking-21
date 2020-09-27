'use strict';

const NOTICES_NUMBER = 8;

// случайные константы, придумала сама
const MAX_RANDOM = 10;
const MAX_ROOMS_NUMBER = 6;
const MAX_GUESTS_NUMBER = 10;
const PRICE_FACTOR = 1000;

const CHECK_IN = 12;
const CHECK_OUT = 14;
const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;
const LOCATION_X_MIN = 0;
// const LOCATION_X_MAX = 1150;

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

const PHOTOS_ADDRESS = `http://o0.github.io/assets/images/tokyo/hotel1.jpg, `;

const map = document.querySelector(`.map`);
const template = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const mapPins = map.querySelector(`.map__pins`);
const locationXMax = mapPins.clientWidth;


const getRandomInRange = (max, min = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFromList = (list) => list[getRandomInRange(list.length - 1, 0)];

const getRandomArrayFromList = (list) => list.filter((item) => item && Math.random() > 0.5);

const getRandomPhotosArray = () => {
  const arr = [];

  for (let i = 1; i <= getRandomInRange(MAX_RANDOM); i++) {
    arr.push(PHOTOS_ADDRESS.replace(`hotel1`, `hotel${i}`));
  }

  return arr;
};

const getNoticesList = () => {
  const notices = [];

  for (let i = 1; i <= NOTICES_NUMBER; i++) {
    const locX = getRandomInRange(locationXMax, LOCATION_X_MIN);
    const locY = getRandomInRange(LOCATION_Y_MAX, LOCATION_Y_MIN);
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
        price: getRandomInRange(MAX_RANDOM) * PRICE_FACTOR,
        type: getRandomFromList(TYPE_LIST),
        rooms: getRandomInRange(MAX_ROOMS_NUMBER),
        guests: getRandomInRange(MAX_GUESTS_NUMBER),
        checkin: `${getRandomInRange(CHECK_OUT, CHECK_IN)}:00`,
        checkout: `${getRandomInRange(CHECK_OUT, CHECK_IN)}:00`,
        features: getRandomArrayFromList(FEATURES_LIST),
        description: `строка с описанием `.repeat(getRandomInRange(MAX_RANDOM)),
        photos: getRandomPhotosArray(),
      }
    });
  }

  return notices;
};

const generatePin = (notice) => {
  const pin = template.cloneNode(true);
  pin.querySelector(`img`).src = notice.author.avatar;
  pin.querySelector(`img`).alt = notice.offer.title;
  pin.style.left = `${notice.location.x}px`;
  pin.style.top = `${notice.location.y}px`;

  return pin;
};

const getPinBlock = () => {
  const pins = getNoticesList();
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < NOTICES_NUMBER; i++) {
    fragment.appendChild(generatePin(pins[i]));
  }

  return fragment;
};

const setPinsOffset = () => {
  const pins = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  const pinStyle = window.getComputedStyle(pins[0]);

  pins.forEach((element) => {
    element.style.left = `${parseInt(element.style.left, 10) - parseInt(pinStyle.width, 10) / 2}px`;
    element.style.top = `${parseInt(element.style.top, 10) - parseInt(pinStyle.height, 10)}px`;
  });

};


map.classList.remove(`map--faded`);
mapPins.appendChild(getPinBlock());
setPinsOffset();
