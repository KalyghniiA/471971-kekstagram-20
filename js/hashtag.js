/* eslint-disable consistent-return */
'use strict';
(function () {
  var HASHTAG_PATTERN = /^#([a-zA-ZА-Яа-я0-9\_]{1,19})$/;
  var HASHTAGS_COUNT = 5;
  var hashtagsInput = window.form.upload.querySelector('.text__hashtags');

  var isHashtagDoubled = function (hastag, uniqueHashtags) {
    if (!uniqueHashtags.includes(hastag)) {
      uniqueHashtags.push(hastag);
      return false;
    }
    return true;
  };

  var validateHashtags = function () {
    var uniqueHashtags = [];
    var hastags = hashtagsInput.value.toLowerCase()
                                              .split(' ')
                                              .filter(function (element) {
                                                return element !== '';
                                              });


    if (hastags.length >= HASHTAGS_COUNT) {
      return hashtagsInput.setCustomValidity('Максимальное количество хэштегов: ' + HASHTAGS_COUNT);
    }


    for (var i = 0; i < hastags.length; i++) {
      if (isHashtagDoubled(hastags[i], uniqueHashtags)) {
        hashtagsInput.setCustomValidity('Хэштеги не должны повторяться');
        return;
      }
      if (!HASHTAG_PATTERN.test(hastags[i])) {
        hashtagsInput.setCustomValidity('Хэштег введен в неправильном формате: Хэштег начинается с #, в хэштеге должен быть один #, могут быть использованны только латинские, кирилические символы, цифры и символ _, максимальное количество символов: 20');
        return;
      }
    }

    hashtagsInput.setCustomValidity('');
    return;
  };


  hashtagsInput.addEventListener('input', function () {
    validateHashtags();
  });

  hashtagsInput.addEventListener('keydown', function (evt) {
    window.utils.pressEsc(evt, evt.stopPropogation);
  }
  );


})();
