/* eslint-disable consistent-return */
'use strict';

(function () {
  var photos = window.data.photos(window.data.count);
  window.posts.createPhoto(photos);
})();
