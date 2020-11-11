'use strict';

const ROOM_FORMS = [`комната`, `комнаты`, `комнат`];
const GUEST_FORMS = [`гостя`, `гостей`, `гостей`];

const OFFER_TYPE = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`
};

const map = document.querySelector(`.map`);
const cardInsertPosition = map.querySelector(`.map__filters-container`);

let isCardOpen = false;
let currentCard = null;

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

  // Этот блок заменяет все, что ниже, до строки 108 включительно, это было заменчание проверяющего по innerHTML и по трудночитаемому куску 98-106

  // const cardTemplate = document.querySelector(`#card`).content;
  // const card = cardTemplate.querySelector(`.map__card`).cloneNode(true);
  // const featuresBlock = card.querySelector(`.popup__features`);
  // const photosBlock = card.querySelector(`.popup__photos`);
  // const photoTemplate = photosBlock.querySelector(`.popup__photo`);
  // const avatarBlock = card.querySelector(`.popup__avatar`);

  // if (Object.keys(notice.offer).length === 0) {
  //   card.hidden = true;
  //   return card;
  // }

  // const roomsText = rooms ? `${rooms} ${window.utils.getWordForm(rooms, ROOM_FORMS)} ` : ``;
  // const guestsText = guests ? (rooms ? `для` : `Для`) + ` ${guests} ${window.utils.getWordForm(guests, GUEST_FORMS)}` : ``;
  // const checkinText = checkin ? `Заезд\u00a0после ${checkin}` : ``;
  // const checkoutText = checkout ? (checkin ? `, выезд` : `Выезд`) + `\u00a0до ${checkout}` : ``;

  // card.querySelector(`.popup__title`).textContent = title || ``;
  // card.querySelector(`.popup__text--address`).textContent = address || ``;
  // card.querySelector(`.popup__text--price`).textContent = price ? `${price}₽/ночь` : ``;
  // card.querySelector(`.popup__type`).textContent = type ? OFFER_TYPE[type] : ``;
  // card.querySelector(`.popup__description`).textContent = description || ``;
  // card.querySelector(`.popup__text--capacity`).textContent = roomsText + guestsText;
  // card.querySelector(`.popup__text--time`).textContent = checkinText + checkoutText;

  // featuresBlock.innerHTML = ``;

  // if (features) {
  //   features.forEach((item) => {
  //     const node = document.createElement(`li`);
  //     node.classList.add(`popup__feature`, `popup__feature--${item}`);
  //     featuresBlock.appendChild(node);
  //   });
  // }

  // if (photos) {
  //   photos.forEach((photo) => {
  //     const node = photoTemplate.cloneNode();
  //     node.src = photo;
  //     photosBlock.appendChild(node);
  //   });
  // }

  // photoTemplate.remove();

  const cardTemplate = document.querySelector(`#card`).content;
  const card = cardTemplate.querySelector(`.map__card`).cloneNode(true);

  if (Object.keys(notice.offer).length === 0) {
    card.hidden = true;
    return card;
  }

  card.querySelector(`.popup__title`).textContent = title || ``;
  card.querySelector(`.popup__text--address`).textContent = address || ``;
  card.querySelector(`.popup__text--price`).textContent = price ? `${price}₽/ночь` : ``;
  card.querySelector(`.popup__type`).textContent = type ? OFFER_TYPE[type] : ``;
  card.querySelector(`.popup__text--capacity`).textContent = (rooms ? `${rooms} ${window.utils.getWordForm(rooms, ROOM_FORMS)}` : ``) +
    (guests ? ` для ${guests} ${window.utils.getWordForm(guests, GUEST_FORMS)}` : ``);
  card.querySelector(`.popup__text--time`).textContent = (checkin ?
    `Заезд\u00a0после ${checkin}` : ``) + (checkin && checkout ? `, ` : ``) + (checkout ? `выезд\u00a0до ${checkout}` : ``);
  card.querySelector(`.popup__features`).innerHTML = features && features.length ?
    features.reduce((string, item) => string + `<li class="popup__feature popup__feature--${item}"></li>`, ``) : ``;
  card.querySelector(`.popup__description`).textContent = description || ``;
  card.querySelector(`.popup__photos`).innerHTML = photos && photos.length ? photos.reduce((string, item) =>
    string + `<img src="${item}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`, ``) : ``;

  const avatarBlock = card.querySelector(`.popup__avatar`);
  avatarBlock.src = avatar;
  avatarBlock.alt = title;

  const nodesToCheckEmptiness = cardTemplate.querySelectorAll(`.map__card > *:not(button):not(img)`);
  nodesToCheckEmptiness.forEach((node) => {
    if (!node.innerHTML) {
      node.remove();
    }
  });

  return card;
};

const showCard = (notice) => {
  if (isCardOpen) {
    currentCard.remove();
  }

  currentCard = getNoticeCard(notice);
  map.insertBefore(currentCard, cardInsertPosition);
  isCardOpen = true;

  document.addEventListener(`keydown`, onDocumentKeydown);
  const closeButton = currentCard.querySelector(`.popup__close`);
  closeButton.addEventListener(`click`, onCloseButtonClick);
};

const closeCard = () => {
  if (!isCardOpen) {
    return;
  }

  const activePin = document.querySelector(`.map__pin--active`);

  document.removeEventListener(`keydown`, onDocumentKeydown);
  isCardOpen = false;
  currentCard.remove();

  if (activePin) {
    activePin.classList.remove(`map__pin--active`);
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === window.utils.Key.ESCAPE && isCardOpen) {
    evt.preventDefault();
    closeCard();
  }
};

const onCloseButtonClick = () => closeCard();

const openCard = (evt) => {
  const pin = evt.target.closest(`.map__pin:not(.map__pin--main)`);
  const activePin = document.querySelector(`.map__pin--active`);

  if (!pin || (activePin === pin && isCardOpen)) {
    return;
  }

  if (activePin) {
    activePin.classList.remove(`map__pin--active`);
  }

  pin.classList.add(`map__pin--active`);
  const notice = window.pins.noticesList.find((item) => item.id === +pin.dataset.id);
  showCard(notice);
};

window.card = {
  openCard,
  closeCard,
};
