'use strict';

(function () {
  var MESSAGES = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var COMMENT_AUTORS = ['Артем', 'Антон', 'Петр', 'Стас', 'Коля', 'Ваня'];
  var PHOTOS_COUNT = 25;

  var generateComment = function () {
    return {
      avatar: 'img/avatar-' + window.utils.randomInteger(1, 6) + '.svg',
      message: MESSAGES[window.utils.randomInteger(0, MESSAGES.length - 1)],
      name: COMMENT_AUTORS[window.utils.randomInteger(0, COMMENT_AUTORS.length - 1)]
    };
  };

  var generateComments = function (commentsCount) {
    var commentsArray = [];

    for (var i = 0; i < commentsCount; i++) {
      commentsArray.push(generateComment());
    }

    return commentsArray;
  };

  var generatePhoto = function (number) {
    return {
      url: 'photos/' + number + '.jpg',
      description: ' описание фотографии',
      likes: window.utils.randomInteger(15, 200),
      comments: generateComments(window.utils.randomInteger(1, 5)),
    };
  };

  var generatePhotos = function (quantity) {
    var photoArray = [];

    for (var i = 0; i < quantity; i++) {
      photoArray.push(generatePhoto(i + 1));
    }

    return photoArray;
  };

  photos = generatePhotos(PHOTOS_COUNT);

  window.data = {
    photos: generatePhotos,
    count: PHOTOS_COUNT
  };

})();
