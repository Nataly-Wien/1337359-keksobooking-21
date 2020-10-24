'use strict';

(() => {
  const API_URL = `https://21.javascript.pages.academy/keksobooking`;
  const TIMEOUT = 10000;

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
        showError(`Запрос к серверу завершен со статусом ${xhr.status} - ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`error`, () => showError(`Произошла ошибка ${xhr.status} - ${xhr.statusText}`));
    xhr.addEventListener(`timeout`, () => showError(`Сервер не ответил в течение ${xhr.timeout} мс`));

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  const load = (onLoad, onError) => {
    const xhr = createRequest(onLoad, onError);
    xhr.open(`GET`, `${API_URL}/data`);
    xhr.send();
  };

  const save = (data, onLoad, onError) => {
    const xhr = createRequest(onLoad, onError);
    xhr.open(`POST`, API_URL);
    xhr.send(data);
  };

  window.backend = {
    load,
    save,
  };
})();
