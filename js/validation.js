'use strict';

(() => {
  const SPECIAL_ROOMS_NUMBER = 100;
  const TITLE_MINLENGTH = 30;
  const TITLE_MAXLENGTH = 100;
  const PRICE_MAX = 1000000;

  const VALIDATION_MESSAGES = [
    `Выбранное Вами количество комнат подходит не более чем для`,
    `100 комнат - не для гостей`,
    `Не для гостей подходит только 100 комнат`,
    `Заполните, пожалуйста, поле с заголовком Вашего объявления`,
    `Минимальная длина заголовка - ${TITLE_MINLENGTH} символов. Остаалось ввести `,
    `Максимальная длина заголовка - ${TITLE_MAXLENGTH} символов. Удалите лишние `,
    `Максимальная цена за ночь - `,
    `Заполните, пожалуйста, поле с ценой за ночь`,
    `Это неправильный формат для цены за ночь`,
    `цена не может быть меньше, чем`,
  ];

  const roomsField = document.querySelector(`select[id="room_number"]`);
  const titleField = document.querySelector(`input[id="title"]`);
  const priceField = document.querySelector(`input[id="price"]`);
  const typeField = document.querySelector(`select[id="type"]`);
  const checkinField = document.querySelector(`select[id="timein"]`);
  const checkoutField = document.querySelector(`select[id="timeout"]`);

  const onCapacityFieldCheck = (evt) => {
    const GUEST_MESSAGE_FORMS = [`гостя`, `гостей`, `гостей`];

    const roomsNumber = Number(roomsField.value);
    const guestsNumber = Number(window.options.capacityField.value);

    roomsField.setCustomValidity(``);
    window.options.capacityField.setCustomValidity(``);
    if (guestsNumber > roomsNumber && roomsNumber !== SPECIAL_ROOMS_NUMBER) {
      evt.target.setCustomValidity(`${VALIDATION_MESSAGES[0]} ${roomsNumber} ${window.utils.getWordForm(roomsNumber, GUEST_MESSAGE_FORMS)}`);
    } else if (roomsNumber === SPECIAL_ROOMS_NUMBER && guestsNumber !== 0) {
      evt.target.setCustomValidity(VALIDATION_MESSAGES[1]);
    } else if (roomsNumber !== SPECIAL_ROOMS_NUMBER && guestsNumber === 0) {
      evt.target.setCustomValidity(VALIDATION_MESSAGES[2]);
    }
    evt.target.reportValidity();
  };

  const onTitleFieldCheck = () => {
    const TITLE_MESSAGE_FORMS = [`символ`, `символа`, `символов`];
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

    titleField.reportValidity();
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

    priceField.reportValidity();
  };

  const onPriceFieldCheck = (evt) => {
    const selectedIndex = typeField.options.selectedIndex;
    let priceMin = 0;

    priceField.setCustomValidity(``);

    switch (typeField.value) {
      case `flat`:
        priceMin = 1000;
        break;
      case `house`:
        priceMin = 5000;
        break;
      case `palace`:
        priceMin = 10000;
        break;
    }

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

  const onTimeFieldsCheck = (evt) => {
    const syncField = evt.target === checkinField ? checkoutField : checkinField;
    syncField.options[evt.target.options.selectedIndex].selected = true;
  };

  const setValidation = () => {
    window.options.capacityField.addEventListener(`change`, onCapacityFieldCheck);
    roomsField.addEventListener(`change`, onCapacityFieldCheck);
    titleField.addEventListener(`input`, onTitleFieldCheck);
    titleField.addEventListener(`invalid`, onTitleFieldInvalid);
    priceField.addEventListener(`invalid`, onPriceFieldInvalid);
    priceField.addEventListener(`input`, onPriceFieldCheck);
    typeField.addEventListener(`change`, onPriceFieldCheck);
    checkinField.addEventListener(`change`, onTimeFieldsCheck);
    checkoutField.addEventListener(`change`, onTimeFieldsCheck);
  };

  window.validation = {
    setValidation,
  };
})();
