'use strict';

const LOCATION_Y_MIN = 130;
const LOCATION_Y_MAX = 630;
const LOCATION_X_MIN = 0;

const MOUSE_PRECISION = 10;

const mapPins = document.querySelector(`.map__pins`);
const locationXMax = mapPins.clientWidth;

const mainPin = mapPins.querySelector(`.map__pin--main`);
const addressField = document.querySelector(`input[id="address"]`);

const initialCoords = {
  x: mainPin.style.left,
  y: mainPin.style.top,
};

const onPinDown = (downEvt) => {
  downEvt.preventDefault();

  const startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY
  };

  const pinXMin = LOCATION_X_MIN - Math.round(window.activation.MAIN_PIN_WIDTH / 2);
  const pinXMax = locationXMax - Math.round(window.activation.MAIN_PIN_WIDTH / 2);
  const pinYMin = LOCATION_Y_MIN - window.activation.mainPinTotalHeight;
  const pinYMax = LOCATION_Y_MAX - window.activation.mainPinTotalHeight;

  let isDragged = false;

  let boundlessLeft = mainPin.offsetLeft;
  let boundlessTop = mainPin.offsetTop;

  const onTargetMove = (moveEvt) => {
    moveEvt.preventDefault();
    isDragged = true;

    const shift = {
      x: moveEvt.clientX - startCoords.x,
      y: moveEvt.clientY - startCoords.y
    };

    const currentX = mainPin.offsetLeft + shift.x;
    const currentY = mainPin.offsetTop + shift.y;
    boundlessLeft += shift.x;
    boundlessTop += shift.y;

    if (currentX >= pinXMin && currentX <= pinXMax && Math.abs(currentX - boundlessLeft) < MOUSE_PRECISION) {
      mainPin.style.left = `${currentX}px`;
    }
    if (currentY >= pinYMin && currentY <= pinYMax && Math.abs(currentY - boundlessTop) < MOUSE_PRECISION) {
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
