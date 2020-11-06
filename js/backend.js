'use strict';

const API_URL = `https://21.javascript.pages.academy/keksobooking`;
const TIMEOUT = 10000;
const ERROR_MESSAGES = [
  `Запрос к серверу завершен со статусом`,
  `Произошла ошибка`,
  `Сервер не ответил в течение`,
];

const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
};

const StatusCode = {
  OK: 200,
};

const createRequest = (makeLoad, showError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
      makeLoad(xhr.response);
    } else {
      showError(`${ERROR_MESSAGES[0]} ${xhr.status} - ${xhr.statusText}`);
    }
  });

  xhr.addEventListener(`error`, () => showError(`${ERROR_MESSAGES[1]} ${xhr.status} ${xhr.statusText}`));
  xhr.addEventListener(`timeout`, () => showError(`${ERROR_MESSAGES[2]} ${xhr.timeout} мс`));

  xhr.timeout = TIMEOUT;
  return xhr;
};

const load = (onLoad, onError) => {
  const xhr = createRequest(onLoad, onError);
  xhr.open(RequestMethod.GET, `${API_URL}/data`);
  xhr.send();
};

const save = (data, onLoad, onError) => {
  const xhr = createRequest(onLoad, onError);
  xhr.open(RequestMethod.POST, API_URL);
  xhr.send(data);
};

window.backend = {
  load,
  save,
};
