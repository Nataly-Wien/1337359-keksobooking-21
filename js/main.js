'use strict';

window.activation.setActivationListener();
window.validation.setValidation();
window.pins.mapPins.addEventListener(`click`, window.card.onMapClickOrKeydown);
window.pins.mapPins.addEventListener(`keydown`, window.card.onMapClickOrKeydown);
window.activation.deactivatePage();
window.filters.setFiltersListener();
window.movePin.setMovingListener();
