'use strict';

(() => {
  const mapPins = document.querySelector(`.map__pins`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

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
    pin.dataset.id = notice.id;

    return pin;
  };

  const getPinBlock = (notices) => {
    const fragment = document.createDocumentFragment();
    notices.forEach((item) => fragment.appendChild(generatePin(item)));
    return fragment;
  };

  const showPins = () => {
    mapPins.appendChild(getPinBlock(window.options.noticesList));

    const pins = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    const pinStyle = window.getComputedStyle(pins[0]);

    pins.forEach((element) => {
      element.style.left = `${parseInt(element.style.left, 10) - parseInt(pinStyle.width, 10) / 2}px`;
      element.style.top = `${parseInt(element.style.top, 10) - parseInt(pinStyle.height, 10)}px`;
    });
  };

  window.pins = {
    showPins,
  };
})();