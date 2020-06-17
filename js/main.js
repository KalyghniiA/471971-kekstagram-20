'use strict';

var MESSAGE_ARRAY = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var COMMENT_NAME = ['Артем', 'Антон', 'Петр', 'Стас', 'Коля', 'Ваня'];
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var pictureContainer = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();
/* var getRandom = function (number) {
  return Math.ceil(Math.random() * number);
}; */

var randomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

var generateComment = function () {
  var comment = {};

  comment.avatar = 'img/avatar-' + randomInteger(1, 6) + '.svg';
  comment.message = MESSAGE_ARRAY[randomInteger(0, MESSAGE_ARRAY.length - 1)];
  comment.name = COMMENT_NAME[randomInteger(0, COMMENT_NAME.length - 1)];

  return comment;
};

var generateArrayComments = function (quantity) {
  var commentsArray = [];

  for (var i = 0; i < quantity; i++) {
    commentsArray.push(generateComment());
  }

  return commentsArray;
};

var generatePhoto = function (number) {
  var photoObj = {};

  photoObj.url = 'photos/' + number + '.jpg';
  photoObj.description = ' описание фотографии';
  photoObj.likes = randomInteger(15, 200);
  photoObj.comments = generateArrayComments(randomInteger(1, 5));

  return photoObj;
};

var generateArrayPhoto = function (quantity) {
  var photos = [];

  for (var i = 0; i < quantity; i++) {
    photos.push(generatePhoto(i + 1));
  }

  return photos;
};

var photosArray = generateArrayPhoto(25);

var createPhoto = function () {

  for (var i = 0; i < photosArray.length; i++) {
    var photo = pictureTemplate.cloneNode(true);
    photo.querySelector('.picture__img').src = photosArray[i].url;
    photo.querySelector('.picture__likes').textContent = photosArray[i].likes;
    photo.querySelector('.picture__comments').textContent = photosArray[i].comments.length;
    fragment.appendChild(photo);
  }
  return pictureContainer.appendChild(fragment);
};

createPhoto();
