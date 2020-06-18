'use strict';

var MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var COMMENT_AUTORS = ['Артем', 'Антон', 'Петр', 'Стас', 'Коля', 'Ваня'];
var QUANTITY_PHOTOS = 25;
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var pictureContainer = document.querySelector('.pictures');
var photos = [];

var getRandomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

var generateComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomInteger(1, 6) + '.svg',
    message: MESSAGES[getRandomInteger(0, MESSAGES.length - 1)],
    name: COMMENT_AUTORS[getRandomInteger(0, COMMENT_AUTORS.length - 1)]
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
    likes: getRandomInteger(15, 200),
    comments: generateComments(getRandomInteger(1, 5))
  };
};

var generatePhotos = function (quantity) {
  var photos = [];

  for (var i = 0; i < quantity; i++) {
    photos.push(generatePhoto(i + 1));
  }

  return photos;
};

var createPhotoElement = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  return photoElement;
};

var createPhotoElements = function (photo) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photo.length; i++) {
    fragment.appendChild(createPhotoElement(photo[i]));
  }
  pictureContainer.appendChild(fragment);
};

photos = generatePhotos(QUANTITY_PHOTOS);
createPhotoElements(photos);
