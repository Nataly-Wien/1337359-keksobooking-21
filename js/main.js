'use strict';

window.activation.setActivationListener();
window.validation.setValidation();
window.options.mapPins.addEventListener(`click`, window.card.onMapClickOrKeydown);
window.options.mapPins.addEventListener(`keydown`, window.card.onMapClickOrKeydown);
window.activation.deactivatePage();
