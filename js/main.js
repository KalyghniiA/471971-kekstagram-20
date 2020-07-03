'use strict';

var MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var COMMENT_AUTORS = ['Артем', 'Антон', 'Петр', 'Стас', 'Коля', 'Ваня'];
var QUANTITY_PHOTOS = 25;
var DEFAULT__PHOTO__SIZE__VALUE = 100;
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var pictureContainer = document.querySelector('.pictures');
var photos = [];
var bigPhotoElement = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');
var commentBlock = bigPhotoElement.querySelector('.social__comments');
var commentCounter = document.querySelector('.social__comment-count');
var commentUploadButton = document.querySelector('.comments-loader');
var body = document.querySelector('body');

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
  var photoArray = [];

  for (var i = 0; i < quantity; i++) {
    photoArray.push(generatePhoto(i + 1));
  }

  return photoArray;
};

var createPhotoElement = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  return photoElement;
};

var createPhotoElements = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createPhotoElement(photos[i]));
  }
  pictureContainer.appendChild(fragment);
};

var clearComment = function () {
  while (commentBlock.firstChild) {
    commentBlock.removeChild(commentBlock.firstChild);
  }
};

var createCommentElement = function (comment) {

  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;

  return commentElement;
};

var createCommentElements = function (comments) {
  clearComment();

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(createCommentElement(comments[i]));
  }

  commentBlock.appendChild(fragment);
};

var disableScroll = function () {
  body.classList.add('modal-open');
};

var openBigPhoto = function (bigPhoto) {
  bigPhotoElement.classList.remove('hidden');
  bigPhotoElement.querySelector('.big-picture__img img').src = bigPhoto.url;
  bigPhotoElement.querySelector('.likes-count').textContent = bigPhoto.likes;
  bigPhotoElement.querySelector('.comments-count').textContent = bigPhoto.comments.length;
  createCommentElements(bigPhoto.comments);
  bigPhotoElement.querySelector('.social__caption').textContent = bigPhoto.description;
  disableScroll();
};

var hideCommentCounter = function () {
  commentCounter.classList.add('hidden');
};

var hideCommentUploadButton = function () {
  commentUploadButton.classList.add('hidden');
};

photos = generatePhotos(QUANTITY_PHOTOS);
createPhotoElements();
/* openBigPhoto(photos[0]); */

hideCommentCounter();
hideCommentUploadButton();

var formFileUpload = document.querySelector('#upload-select-image');
var controlFormOpen = formFileUpload.querySelector('#upload-file');
var controlFormClose = formFileUpload.querySelector('#upload-cancel');
var imageEditingForm = formFileUpload.querySelector('.img-upload__overlay');
var pinSaturationEffect = formFileUpload.querySelector('.effect-level__pin');
var controlScaleMin = formFileUpload.querySelector('.scale__control--smaller');
var controlScaleMax = formFileUpload.querySelector('.scale__control--bigger');
var controlScaleValue = formFileUpload.querySelector('.scale__control--value');
var photoPreview = formFileUpload.querySelector('.img-upload__preview');
var fieldsetEffectsPhoto = formFileUpload.querySelector('.img-upload__effects');
var entryFieldHashtag = formFileUpload.querySelector('.text__hashtag');
var buttonSubmit = formFileUpload.querySelector('#upload-submit');
/* var wrongSymbolsRegExp = /\W/; */

var assigningPhotoSizeValue = function(value) {
  controlScaleValue.value = value + '%';
  photoPreview.style = 'transform:scale(' + value / 100 + ');';
};

var changeEffectImage = function (evt) {
  var optionEffect = 'effects__preview--' + evt.target.value;
  photoPreview.className = 'img-upload__preview ' + optionEffect;
};

controlFormOpen.addEventListener('change', function (evt) {
  evt.preventDefault();
  body.classList.add('modal-open');
  imageEditingForm.classList.remove('hidden');
  assigningPhotoSizeValue(DEFAULT__PHOTO__SIZE__VALUE);
});

controlFormClose.addEventListener('click', function (evt) {
  evt.preventDefault();
  body.classList.remove('modal-open');
  imageEditingForm.classList.add('hidden');
});

controlScaleMin.addEventListener('click', function (evt) {
  evt.preventDefault();
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue > 25) {
    assigningPhotoSizeValue(fieldValue - 25);
  }
});

controlScaleMax.addEventListener('click', function (evt) {
  evt.preventDefault();
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue <= 75) {
    assigningPhotoSizeValue(fieldValue + 25);
  }
});

fieldsetEffectsPhoto.addEventListener('click', changeEffectImage);

entryFieldHashtag.addEventListener('input', function () {
  var splittedTags = entryFieldHashtag.value.split('#');
  for (var i = 0; i < splittedTags.length; i++) {
    var tag = splittedTags[i].toLowerCase();
    var tagText = tag.slice(1);

    var isHashTag = tag.charAt(0) === TAG_SYMBOL;
    var isTagTooShort = tag.length === 1;
    var isTagTooLong = splittedTags[i].length > TAG_MAX_LENGTH;
    var isTagExists = acceptedTags.indexOf(tag) !== -1;
    var isWrongTag = wrongSymbolsRegExp.test(tagText);

    if (!isHashTag) {
      return 'Это не хэштег!';
    } else if (isTagTooShort) {
      return 'Хэштег не может состоять только из «' + TAG_SYMBOL + '»';
    } else if (isWrongTag) {
      return 'Хэштег ' + tag + ' введен некорректно';
    }

    if (isTagTooLong) {
      return 'Хэштег ' + tag + ' слишком длинный (лишние ' + (tag.length - TAG_MAX_LENGTH) + ' симв.)';
    }

    if (isTagExists) {
      return 'Хэштег ' + tag + ' уже введен';
    } else {
      acceptedTags.push(tag);
    }
  }

})
/*
  1) сделать массив из строк
  2)
*/


/* for (var i = 0; i < splittedTags.length; i++) {
  var tag = splittedTags[i].toLowerCase();
  var tagText = tag.slice(1);

  var isHashTag = tag.charAt(0) === TAG_SYMBOL;
  var isTagTooShort = tag.length === 1;
  var isTagTooLong = splittedTags[i].length > TAG_MAX_LENGTH;
  var isTagExists = acceptedTags.indexOf(tag) !== -1;
  var isWrongTag = wrongSymbolsRegExp.test(tagText);

  if (!isHashTag) {
    return 'Это не хэштег!';
  } else if (isTagTooShort) {
    return 'Хэштег не может состоять только из «' + TAG_SYMBOL + '»';
  } else if (isWrongTag) {
    return 'Хэштег ' + tag + ' введен некорректно';
  }

  if (isTagTooLong) {
    return 'Хэштег ' + tag + ' слишком длинный (лишние ' + (tag.length - TAG_MAX_LENGTH) + ' симв.)';
  }

  if (isTagExists) {
    return 'Хэштег ' + tag + ' уже введен';
  } else {
    acceptedTags.push(tag);
  }
} */
