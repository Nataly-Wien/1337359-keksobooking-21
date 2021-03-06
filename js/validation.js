'use strict';

const SPECIAL_ROOMS_NUMBER = 100;
const TITLE_MINLENGTH = 30;
const TITLE_MAXLENGTH = 100;
const PRICE_MAX = 1000000;

const IMAGE_MAX_SIZE = 512000;
const IMAGE_TYPES = [`image/gif`, `image/jpeg`, `image/png`];

const IMAGE_ERROR_MESSAGES = [
  `Максимальный размер файла - 500 Кб`,
  `Неверный тип файла. Допустимые типы файла изображения - `,
];

const VALIDATION_MESSAGES = [
  `Выбранное Вами количество комнат подходит не более чем для`,
  `100 комнат - не для гостей`,
  `Не для гостей подходит только 100 комнат`,
  `Заполните, пожалуйста, поле с заголовком Вашего объявления`,
  `Минимальная длина заголовка - ${TITLE_MINLENGTH} символов. Осталось ввести `,
  `Максимальная длина заголовка - ${TITLE_MAXLENGTH} символов. Удалите лишние `,
  `Максимальная цена за ночь - `,
  `Заполните, пожалуйста, поле с ценой за ночь`,
  `Это неправильный формат для цены за ночь`,
  `цена не может быть меньше, чем`,
];

const GUEST_MESSAGE_FORMS = [`гостя`, `гостей`, `гостей`];
const TITLE_MESSAGE_FORMS = [`символ`, `символа`, `символов`];

const priceMap = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const noticeForm = document.querySelector(`.ad-form`);
const roomsField = noticeForm.querySelector(`select[id="room_number"]`);
const capacityField = noticeForm.querySelector(`select[id="capacity"]`);
const titleField = noticeForm.querySelector(`input[id="title"]`);
const priceField = noticeForm.querySelector(`input[id="price"]`);
const typeField = noticeForm.querySelector(`select[id="type"]`);
const checkinField = noticeForm.querySelector(`select[id="timein"]`);
const checkoutField = noticeForm.querySelector(`select[id="timeout"]`);

const onCapacityFieldCheck = (evt) => {
  const roomsNumber = Number(roomsField.value);
  const guestsNumber = Number(capacityField.value);
  let target = evt.target;

  if (evt.target === noticeForm) {
    target = capacityField;
  }

  roomsField.setCustomValidity(``);
  capacityField.setCustomValidity(``);
  if (guestsNumber > roomsNumber && roomsNumber !== SPECIAL_ROOMS_NUMBER) {
    target.setCustomValidity(`${VALIDATION_MESSAGES[0]} ${roomsNumber} ${window.utils.getWordForm(roomsNumber, GUEST_MESSAGE_FORMS)}`);
  } else if (roomsNumber === SPECIAL_ROOMS_NUMBER && guestsNumber !== 0) {
    target.setCustomValidity(VALIDATION_MESSAGES[1]);
  } else if (roomsNumber !== SPECIAL_ROOMS_NUMBER && guestsNumber === 0) {
    target.setCustomValidity(VALIDATION_MESSAGES[2]);
  }
  return target.reportValidity();
};

const onTitleFieldCheck = () => {
  titleField.value = titleField.value.trimRight();
  const fieldLength = titleField.value.length;

  titleField.setCustomValidity(``);

  if (fieldLength < TITLE_MINLENGTH) {
    titleField.setCustomValidity(VALIDATION_MESSAGES[4] +
      `${TITLE_MINLENGTH - fieldLength} ${window.utils.getWordForm(TITLE_MINLENGTH - fieldLength, TITLE_MESSAGE_FORMS)}`);
  }

  if (fieldLength > TITLE_MAXLENGTH) {
    titleField.setCustomValidity(VALIDATION_MESSAGES[5] +
      `${fieldLength - TITLE_MAXLENGTH} ${window.utils.getWordForm(fieldLength - TITLE_MAXLENGTH, TITLE_MESSAGE_FORMS)}`);
  }
};

const onTitleFieldInvalid = () => {
  if (titleField.validity.valueMissing) {
    titleField.setCustomValidity(VALIDATION_MESSAGES[3]);
  }
};

const onPriceFieldInvalid = () => {
  switch (true) {
    case priceField.validity.rangeOverflow:
      priceField.setCustomValidity(VALIDATION_MESSAGES[6] + `${new Intl.NumberFormat(`ru`).format(PRICE_MAX)} руб.`);
      break;
    case priceField.validity.valueMissing:
      priceField.setCustomValidity(VALIDATION_MESSAGES[7]);
      break;
    case priceField.validity.badInput || priceField.validity.rangeUnderflow:
      priceField.setCustomValidity(VALIDATION_MESSAGES[8]);
      break;
  }
};

const onPriceFieldCheck = (evt) => {
  const selectedIndex = typeField.options.selectedIndex;
  const priceMin = priceMap[typeField.value];
  priceField.setCustomValidity(``);

  if (priceField.value < priceMin) {
    priceField.setCustomValidity(`Для типа жилья "${typeField.options[selectedIndex].text}" ` + VALIDATION_MESSAGES[9] + ` ${priceMin} руб.`);
  }

  if (!(evt.target === typeField && priceField.validity.valueMissing)) {
    priceField.reportValidity();
  }

  if (evt.target === typeField) {
    priceField.placeholder = priceMin;
  }
};

const resetPlaceholder = () => {
  priceField.placeholder = priceMap[typeField.value];
};

const onTimeFieldsCheck = (evt) => {
  checkinField.value = evt.target.value;
  checkoutField.value = evt.target.value;
};

const resetCustomValidity = (evt) => {
  evt.target.setCustomValidity(``);
};

const isImageFileValid = (file) => {
  let isValid = true;

  if (!IMAGE_TYPES.some((item) => file.type === item)) {
    isValid = false;
    window.messages.showError(IMAGE_ERROR_MESSAGES[1] + IMAGE_TYPES.map((item) => item.slice(6)).join(`, `));
  }

  if (file.size > IMAGE_MAX_SIZE) {
    isValid = false;
    window.messages.showError(IMAGE_ERROR_MESSAGES[0]);
  }

  return isValid;
};

const setValidation = () => {
  capacityField.addEventListener(`change`, onCapacityFieldCheck);
  roomsField.addEventListener(`change`, onCapacityFieldCheck);
  titleField.addEventListener(`change`, onTitleFieldCheck);
  titleField.addEventListener(`invalid`, onTitleFieldInvalid);
  priceField.addEventListener(`invalid`, onPriceFieldInvalid);
  priceField.addEventListener(`change`, onPriceFieldCheck);
  typeField.addEventListener(`change`, onPriceFieldCheck);
  checkinField.addEventListener(`change`, onTimeFieldsCheck);
  checkoutField.addEventListener(`change`, onTimeFieldsCheck);
  titleField.addEventListener(`input`, resetCustomValidity);
  priceField.addEventListener(`input`, resetCustomValidity);
};

window.validation = {
  onCapacityFieldCheck,
  setValidation,
  isImageFileValid,
  resetPlaceholder,
};
