/* eslint-disable consistent-return */
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
var QUANTITY_HASTAG = 5;
var HASHTAG_PATTERN = /^#([a-zA-ZА-Яа-я0-9\_]{1,19})$/;
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var pictureContainer = document.querySelector('.pictures');
var photos = [];
var bigPhotoElement = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');
var commentBlock = bigPhotoElement.querySelector('.social__comments');
var commentCounter = document.querySelector('.social__comment-count');
var commentUploadButton = document.querySelector('.comments-loader');
var body = document.querySelector('body');
var formFileUpload = document.querySelector('#upload-select-image');
var controlFormOpen = formFileUpload.querySelector('#upload-file');
var controlFormClose = formFileUpload.querySelector('#upload-cancel');
var imageEditingForm = formFileUpload.querySelector('.img-upload__overlay');
var pinSaturationEffect = formFileUpload.querySelector('.effect-level__pin');
var saturationFilterLine = formFileUpload.querySelector('.effect-level__line');
var controlScaleMin = formFileUpload.querySelector('.scale__control--smaller');
var controlScaleMax = formFileUpload.querySelector('.scale__control--bigger');
var controlScaleValue = formFileUpload.querySelector('.scale__control--value');
var photoPreview = formFileUpload.querySelector('.img-upload__preview');
var fieldsetEffectsPhoto = formFileUpload.querySelector('.img-upload__effects');
var hashtagsInput = formFileUpload.querySelector('.text__hashtags');
var buttonSubmit = formFileUpload.querySelector('.img-upload__submit');
var currentEffect = null;
var currentEffects = null;

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

var effects = {
  chrome: {
    class: 'effects__preview--chrome',
    changeIntensity: function (value) {
      return 'grayscale(' + parseFloat(value).toFixed(2) / 100 + ')';
    },
    minDepth: 0,
    maxDepth: 1
  },
  sepia: {
    class: 'effects__preview--sepia',
    changeIntensity: function (value) {
      return 'sepia(' + parseFloat(value).toFixed(2) / 100 + ')';
    },
    minDepth: 0,
    maxDepth: 1
  },
  marvin: {
    class: 'effects__preview--marvin',
    changeIntensity: function (value) {
      return 'invert(' + parseFloat(value).toFixed(2) + '%)';
    },
    minDepth: 0,
    maxDepth: 100
  },
  phobos: {
    class: 'effects__preview--phobos',
    changeIntensity: function (value) {
      return 'blur(' + (parseFloat(value).toFixed(2) * (this.maxDepth - this.minDepth) + this.minDepth) + 'px)';
    },
    minDepth: 0,
    maxDepth: parseInt('3px', 10)
  },
  heat: {
    class: 'effects__preview--heat',
    changeIntensity: function (value) {
      return 'brightness(' + (parseFloat(value).toFixed(2) * (this.maxDepth - this.minDepth) + this.minDepth) + ')';
    },
    minDepth: 1,
    maxDepth: 3
  }
};

var assigningPhotoSizeValue = function (value) {
  controlScaleValue.value = value + '%';
  photoPreview.style = 'transform:scale(' + value / 100 + ');';
};

var changeEffectImage = function (evt) {
  if (currentEffect) {
    photoPreview.classList.remove(currentEffect.class);
  }
  currentEffect = effects[evt.target.value];
  console.log(currentEffect);
  photoPreview.classList.add(currentEffect.class);
};

var onPopapEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopapForm();
  }
};

var openPopapForm = function (evt) {
  evt.preventDefault();
  body.classList.add('modal-open');
  imageEditingForm.classList.remove('hidden');
  assigningPhotoSizeValue(DEFAULT__PHOTO__SIZE__VALUE);
  document.addEventListener('keydown', onPopapEscPress);
};

var closePopapForm = function (evt) {
  evt.preventDefault();
  body.classList.remove('modal-open');
  imageEditingForm.classList.add('hidden');
  document.removeEventListener('keycode', onPopapEscPress);
};

var reductionPhotoSize = function (evt) {
  evt.preventDefault();
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue > 25) {
    assigningPhotoSizeValue(fieldValue - 25);
  }
};

var increasePhotoSize = function (evt) {
  evt.preventDefault();
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue <= 75) {
    assigningPhotoSizeValue(fieldValue + 25);
  }
};

var isHashtagDoubled = function (hastags) {
  var uniqueHashtags = [];
  for (var i = 0; i < hastags.length; i++) {
    if (!uniqueHashtags.includes(hastags[i])) {
      uniqueHashtags.push(hastags[i]);
    } else {
      return hashtagsInput.setCustomValidity('Хэштеги не должны повторяться');
    }
  }
  if (uniqueHashtags.length !== hastags.length) {
    return hashtagsInput.setCustomValidity('Хэштеги не должны повторяться');
  }
  return;
};

var validationHashtags = function () {
  var hastags = hashtagsInput.value.toLowerCase()
                                            .split(' ')
                                            .filter(function (element) {
                                              return element !== '';
                                            });


  if (hastags.length >= QUANTITY_HASTAG) {
    return hashtagsInput.setCustomValidity('Максимальное количество хэштегов: ' + QUANTITY_HASTAG);
  }


  for (var i = 0; i < hastags.length; i++) {
    if (!HASHTAG_PATTERN.test(hastags[i])) {
      return hashtagsInput.setCustomValidity('Хэштег введен в неправильном формате: Хэштег начинается с #, в хэштеге должен быть один #, могут быть использованны только латинские, кирилические символы, цифры и символ _, максимальное количество символов: 20');
    }
  }

  isHashtagDoubled(hastags);
};

var gettingPinCoordinates = function (evt) {
  var pinCoordinates = getComputedStyle(pinSaturationEffect).left;
  var currnetSaturation = parseInt(pinCoordinates, 10) / parseInt(getComputedStyle(saturationFilterLine).width, 10);
  currentEffects = currentEffect;
  console.log(currentEffects);
  console.log(photoPreview.style.transform = currentEffects.changeIntensity(currnetSaturation));
};


controlFormOpen.addEventListener('change', openPopapForm);

controlFormClose.addEventListener('click', closePopapForm);

controlScaleMin.addEventListener('click', reductionPhotoSize);

controlScaleMax.addEventListener('click', increasePhotoSize);

fieldsetEffectsPhoto.addEventListener('click', changeEffectImage);

hashtagsInput.addEventListener('input', validationHashtags);

pinSaturationEffect.addEventListener('mouseup', gettingPinCoordinates);





buttonSubmit.addEventListener('', function (evt) {
  evt.preventDefault();
});
/*
  1) сделать массив из строк
  2)
*/


