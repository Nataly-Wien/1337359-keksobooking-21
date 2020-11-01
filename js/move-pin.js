'use strict';

const mainPin = document.querySelector(`.map__pin--main`);
const addressField = document.querySelector(`input[id="address"]`);

const initialCoords = {
  x: mainPin.style.left,
  y: mainPin.style.top,
};

const onPinDown = (downEvt) => {
  if (!window.utils.isPageActive) {
    return;
  }

  downEvt.preventDefault();

  const startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY
  };
  let isDragged = false;

  const onTargetMove = (moveEvt) => {
    moveEvt.preventDefault();
    isDragged = true;
    const shift = {
      x: moveEvt.clientX - startCoords.x,
      y: moveEvt.clientY - startCoords.y
    };

    const currentX = mainPin.offsetLeft + shift.x;
    const currentY = mainPin.offsetTop + shift.y;

    const pinXMin = window.utils.LOCATION_X_MIN - Math.round(window.activation.MAIN_PIN_WIDTH / 2);
    const pinXMax = window.utils.locationXMax - Math.round(window.activation.MAIN_PIN_WIDTH / 2);
    const pinYMin = window.utils.LOCATION_Y_MIN - window.activation.mainPinTotalHeight;
    const pinYMax = window.utils.LOCATION_Y_MAX - window.activation.mainPinTotalHeight;

    if (currentX >= pinXMin && currentX <= pinXMax) {
      mainPin.style.left = `${currentX}px`;
    }

    if (currentY >= pinYMin && currentY <= pinYMax) {
      mainPin.style.top = `${currentY}px`;
    }

    addressField.value = window.activation.getPinCoords(mainPin);

    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;
  };

  const onTargetUp = (upEvt) => {
    upEvt.preventDefault(upEvt);
    addressField.value = window.activation.getPinCoords(mainPin);

    if (isDragged) {
      const onTargetClick = (clickEvt) => {
        clickEvt.preventDefault();
        mainPin.removeEventListener(`click`, onTargetClick);
      };

      mainPin.addEventListener(`click`, onTargetClick);
    }

    document.removeEventListener(`mousemove`, onTargetMove);
    document.removeEventListener(`mouseup`, onTargetUp);
  };

  document.addEventListener(`mousemove`, onTargetMove);
  document.addEventListener(`mouseup`, onTargetUp);
};

const setMovingListener = () => {
  mainPin.addEventListener(`mousedown`, onPinDown);
};

const returnPinToStart = () => {
  mainPin.style.left = initialCoords.x;
  mainPin.style.top = initialCoords.y;
  addressField.value = window.activation.getPinCoords(mainPin);
};

window.movePin = {
  setMovingListener,
  returnPinToStart,
};
