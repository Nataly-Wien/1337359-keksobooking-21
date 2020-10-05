'use strict';

const NOTICES_NUMBER = 8;

const MAX_RANDOM = 10;
const MAX_ROOMS_NUMBER = 3;
const SPECIAL_ROOMS_NUMBER = 100;
const MAX_GUESTS_NUMBER = 3;
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

const ROOMS_VALIDATION_MESSAGES = [
  `Выбранное Вами количество комнат подходит не более чем для`,
  `100 комнат - не для гостей`,
  `Не для гостей подходит только 100 комнат`,
];

const map = document.querySelector(`.map`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const cardInsertPosition = map.querySelector(`.map__filters-container`);
const mapPins = map.querySelector(`.map__pins`);
const locationXMax = mapPins.clientWidth;
const mainPin = map.querySelector(`.map__pin--main`);
const noticeForm = document.querySelector(`.ad-form`);
const noticeFormElements = noticeForm.querySelectorAll(`fieldset`);
const filterForm = map.querySelector(`.map__filters`);
const filterFormElements = filterForm.querySelectorAll(`select, fieldset`);
const addressField = document.querySelector(`input[name="address"]`);
const roomsField = document.querySelector(`select[id="room_number"]`);
const capacityField = document.querySelector(`select[id="capacity"]`);

let isPageActive = false;
let isCardOpen = false;
let noticesList = [];
let currentCard = null;


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

const getPinBlock = (notices) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < NOTICES_NUMBER; i++) {
    let pin = generatePin(notices[i]);
    pin.setAttribute(`data-index`, i);
    fragment.appendChild(pin);
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

const getTipCoords = (element) => {
  const elemStyle = window.getComputedStyle(element);
  const x = parseInt(element.style.left, 10) + Math.round(parseInt(elemStyle.width, 10) / 2);
  const y = parseInt(element.style.top, 10) + (isPageActive ? parseInt(elemStyle.height, 10) : Math.round(parseInt(elemStyle.height, 10) / 2));

  return `${x}, ${y}`;
};

const toggleElementsDisabling = (list, state) => {
  list.forEach((elem) => {
    elem.disabled = state;
  });
};

const isClickOrEnter = (evt) => evt.button === 0 || evt.key === `Enter`;

const activatePage = (evt) => {
  if (isPageActive || !isClickOrEnter(evt)) {
    return;
  }

  isPageActive = true;
  if (map.classList.contains(`map--faded`)) {
    map.classList.remove(`map--faded`);
  }
  if (noticeForm.classList.contains(`ad-form--disabled`)) {
    noticeForm.classList.remove(`ad-form--disabled`);
  }
  toggleElementsDisabling(noticeFormElements, false);
  toggleElementsDisabling(filterFormElements, false);

  addressField.value = getTipCoords(mainPin);
  capacityField.options[2].selected = true;

  noticesList = getNoticesList();
  mapPins.appendChild(getPinBlock(noticesList));
  setPinsOffset();
};

const deactivatePage = () => {
  isPageActive = false;
  if (!map.classList.contains(`map--faded`)) {
    map.classList.add(`map--faded`);
  }
  if (!noticeForm.classList.contains(`ad-form--disabled`)) {
    noticeForm.classList.add(`ad-form--disabled`);
  }
  toggleElementsDisabling(noticeFormElements, true);
  toggleElementsDisabling(filterFormElements, true);

  addressField.value = getTipCoords(mainPin);
};

const onCapacityFieldCheck = (evt) => {
  const roomsNumber = Number(roomsField.value);
  const guestsNumber = Number(capacityField.value);

  roomsField.setCustomValidity(``);
  capacityField.setCustomValidity(``);
  if (guestsNumber > roomsNumber && roomsNumber !== SPECIAL_ROOMS_NUMBER) {
    evt.target.setCustomValidity(`${ROOMS_VALIDATION_MESSAGES[0]} ${roomsNumber} ${getWordForm(roomsNumber, GUEST_FORMS)}`);
  } else if (roomsNumber === SPECIAL_ROOMS_NUMBER && guestsNumber !== 0) {
    evt.target.setCustomValidity(ROOMS_VALIDATION_MESSAGES[1]);
  } else if (roomsNumber !== SPECIAL_ROOMS_NUMBER && guestsNumber === 0) {
    evt.target.setCustomValidity(ROOMS_VALIDATION_MESSAGES[2]);
  }
  evt.target.reportValidity();
};

const showCard = (index) => {
  if (isCardOpen) {
    currentCard.remove();
  }
  currentCard = getNoticeCard(noticesList[index]);
  map.insertBefore(currentCard, cardInsertPosition);
  document.addEventListener(`keydown`, onDocumentKeydown);
  const closeButton = currentCard.querySelector(`.popup__close`);
  closeButton.addEventListener(`click`, onCloseButtonClick);
  closeButton.addEventListener(`keydown`, onCloseButtonClick);
  isCardOpen = true;
};

const closeCard = () => {
  document.removeEventListener(`keydown`, onDocumentKeydown);
  isCardOpen = false;
  currentCard.remove();
};

const onMapClickOrKeydown = (evt) => {
  const index = evt.target.dataset.index ? evt.target.dataset.index : evt.target.closest(`button`).dataset.index;

  if (index && isClickOrEnter(evt)) {
    showCard(index);
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === `Escape` && isCardOpen) {
    evt.preventDefault();
    closeCard(evt);
  }
};

const onCloseButtonClick = (evt) => {
  if (isClickOrEnter(evt)) {
    closeCard(evt);
  }
};


mainPin.addEventListener(`mousedown`, activatePage);
mainPin.addEventListener(`keydown`, activatePage);
capacityField.addEventListener(`change`, onCapacityFieldCheck);
roomsField.addEventListener(`change`, onCapacityFieldCheck);
mapPins.addEventListener(`click`, onMapClickOrKeydown);
mapPins.addEventListener(`keydown`, onMapClickOrKeydown);
deactivatePage();
