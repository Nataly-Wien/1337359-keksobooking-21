'use strict';

const NOTICES_NUMBER = 8;

const MAX_RANDOM = 10;
const MAX_ROOMS_NUMBER = 6;
const MAX_GUESTS_NUMBER = 10;
const MAX_PHOTOS_NUMBER = 3;
const PRICE_FACTOR = 1000;

const CHECK_IN = 12;
const CHECK_OUT = 14;
const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;
const LOCATION_X_MIN = 0;
const PHOTOS_ADDRESS = `http://o0.github.io/assets/images/tokyo/hotel1.jpg`;
const ROOM_FORMS = [`комната`, `комнаты`, `комнат`];
const GUEST_FORMS = [`гостя`, `гостей`, `гостей`];

const TYPE_LIST = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const OFFER_TYPE_MAP = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`
};

const FEATURES_LIST = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const map = document.querySelector(`.map`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const cardInsertPosition = map.querySelector(`.map__filters-container`);
const mapPins = map.querySelector(`.map__pins`);
const locationXMax = mapPins.clientWidth;


const getRandomInRange = (max, min = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFromList = (list) => list[getRandomInRange(list.length - 1, 0)];

const getRandomArrayFromList = (list) => list.filter((item) => item && Math.random() > 0.5);

const getRandomPhotosArray = () => {
  const arr = [];

  for (let i = 1; i <= getRandomInRange(MAX_PHOTOS_NUMBER); i++) {
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
  const pin = pinTemplate.cloneNode(true);

  if (Object.keys(notice.offer).length === 0) {
    pin.hidden = true;
    return pin;
  }

  pin.querySelector(`img`).src = notice.author.avatar;
  pin.querySelector(`img`).alt = notice.offer.title;
  pin.style.left = `${notice.location.x}px`;
  pin.style.top = `${notice.location.y}px`;

  return pin;
};

const getPinBlock = (pins) => {
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

const getWordForm = (number, forms) => {
  const cases = [2, 0, 1, 1, 1, 2];
  number = Math.floor(Math.abs(number)) % 100;

  return forms[number > 4 && number < 20 ? 2 : cases[Math.min(number % 10, 5)]];
};

const getNoticeCard = (notice) => {
  const {
    author: {
      avatar
    },
    offer: {
      title,
      address,
      price,
      type,
      rooms,
      guests,
      checkin,
      checkout,
      features,
      description,
      photos
    }
  } = notice;

  const card = cardTemplate.cloneNode(true);

  if (Object.keys(notice.offer).length === 0) {
    card.hidden = true;
    return card;
  }

  card.querySelector(`.popup__title`).textContent = title || ``;
  card.querySelector(`.popup__text--address`).textContent = address || ``;
  card.querySelector(`.popup__text--price`).textContent = price ? `${price}₽/ночь` : ``;
  card.querySelector(`.popup__type`).textContent = type ? OFFER_TYPE_MAP[type] : ``;
  card.querySelector(`.popup__text--capacity`).textContent = (rooms ? `${rooms} ${getWordForm(rooms, ROOM_FORMS)}` : ``) +
    (guests ? ` для ${guests} ${getWordForm(guests, GUEST_FORMS)}` : ``);
  card.querySelector(`.popup__text--time`).textContent = (checkin ?
    `Заезд\u00a0после ${checkin}` : ``) + (checkin && checkout ? `, ` : ``) + (checkout ? `выезд\u00a0до ${checkout}` : ``);
  card.querySelector(`.popup__features`).innerHTML = features && features.length ?
    features.reduce((string, item) => string + `<li class="popup__feature popup__feature--${item}"></li>`, ``) : ``;
  card.querySelector(`.popup__description`).textContent = description || ``;
  card.querySelector(`.popup__photos`).innerHTML = photos && photos.length ?
    photos.reduce((string, item) => string + `<img src="${item}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`, ``) : ``;

  const avatarBlock = card.querySelector(`.popup__avatar`);
  avatarBlock.src = avatar;
  avatarBlock.alt = title;

  const nodesToCheckEmptiness = Array.from(document.querySelector(`#card`).content.querySelectorAll(`.map__card > *:not(button):not(img)`));
  nodesToCheckEmptiness.forEach((node) => {
    if (!node.innerHTML) {
      node.remove();
    }
  });

  return card;
};


map.classList.remove(`map--faded`);
const noticesList = getNoticesList();
mapPins.appendChild(getPinBlock(noticesList));
setPinsOffset();
map.insertBefore(getNoticeCard(noticesList[0]), cardInsertPosition);
