'use strict';

(function () {
  var pressEsc = function (evt, action) {
    if (evt.key === 'Escape') {
      action();
    }
  };

  var randomInteger = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  window.utils = {
    pressEsc: pressEsc,
    randomInteger: randomInteger
  };
})();
