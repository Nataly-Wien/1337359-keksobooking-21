'use strict';

(() => {
  const PIN_WIDTH = 50;
  const PIN_HEIGHT = 70;

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
    pin.style.left = `${notice.location.x - PIN_WIDTH / 2}px`;
    pin.style.top = `${notice.location.y - PIN_HEIGHT}px`;
    pin.dataset.id = notice.id;

    return pin;
  };

  const getPinBlock = (notices) => {
    const fragment = document.createDocumentFragment();
    notices.forEach((item) => fragment.appendChild(generatePin(item)));
    return fragment;
  };

  const showPins = (noticesList) => {
    mapPins.appendChild(getPinBlock(noticesList));
  };

  const removePins = () => {
    mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`).forEach((node) => {
      mapPins.removeChild(node);
    });

  };

  window.pins = {
    mapPins,
    showPins,
    removePins,
  };
})();
