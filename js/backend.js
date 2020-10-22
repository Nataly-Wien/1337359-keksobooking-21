'use strict';

(() => {
  const loadURL = `https://21.javascript.pages.academy/keksobooking/data`;
  const sendURL = `https://21.javascript.pages.academy/keksobooking`;
  const TIMEOUT = 10000;
  const statusCode = {
    OK: 200,
  };

  const createRequest = (makeLoad, showError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      if (xhr.status === statusCode.OK) {
        makeLoad(xhr.response);
      } else {
        showError(`Запрос к серверу завершен со статусом ${xhr.status} - ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`error`, () => showError(`Произошла ошибка ${xhr.status} - ${xhr.statusText}`));
    xhr.addEventListener(`timeout`, () => showError(`Отправка данных не успела выполниться за ${xhr.timeout} мс`));

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  const load = (onLoad, onError) => {
    const xhr = createRequest(onLoad, onError);
    xhr.open(`GET`, loadURL);
    xhr.send();
  };

  const save = (data, onLoad, onError) => {
    const xhr = createRequest(onLoad, onError);
    xhr.open(`POST`, sendURL);
    xhr.send(data);
  };

  window.backend = {
    load,
    save,
  };
})();
