/* eslint-disable consistent-return */
'use strict';

var MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var COMMENT_AUTORS = ['Артем', 'Антон', 'Петр', 'Стас', 'Коля', 'Ваня'];
var PHOTOS_COUNT = 25;
var DEFAULT_SCALE = 100;
var HASHTAGS_COUNT = 5;
var STEP_SIZE_PHOTO = 25;
var MIN_SIZE_PHOTO = 25;
var MAX_SIZE_PHOTO = 100;
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
var photoPreview = formFileUpload.querySelector('.img-upload__preview img');
var fieldsetEffectsPhoto = formFileUpload.querySelector('.img-upload__effects');
var hashtagsInput = formFileUpload.querySelector('.text__hashtags');
var buttonSubmit = formFileUpload.querySelector('.img-upload__submit');
var saturationScale = formFileUpload.querySelector('.img-upload__effect-level');
var bigPhotoElementImage = bigPhotoElement.querySelector('.big-picture__img img');
var bigPhotoElementLikes = bigPhotoElement.querySelector('.likes-count');
var bigPhotoElementCommentsCounter = bigPhotoElement.querySelector('.comments-count');
var bigPhotoElementCommentsText = bigPhotoElement.querySelector('.social__caption');
var effects = {
  none: {
    class: '',
    changeIntensity: function () {
      return 'none';
    }
  },
  chrome: {
    class: 'effects__preview--chrome',
    changeIntensity: function (value) {
      return 'grayscale(' + parseFloat(value).toFixed(2) + ')';
    },
    minDepth: 0,
    maxDepth: 1
  },
  sepia: {
    class: 'effects__preview--sepia',
    changeIntensity: function (value) {
      return 'sepia(' + parseFloat(value).toFixed(2) + ')';
    },
    minDepth: 0,
    maxDepth: 1
  },
  marvin: {
    class: 'effects__preview--marvin',
    changeIntensity: function (value) {
      return 'invert(' + (parseFloat(value).toFixed(2) * 100) + '%)';
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
    maxDepth: 3
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
var currentEffect = effects.none;

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
  bigPhotoElementImage.src = bigPhoto.url;
  bigPhotoElementLikes.textContent = bigPhoto.likes;
  bigPhotoElementCommentsCounter.textContent = bigPhoto.comments.length;
  createCommentElements(bigPhoto.comments);
  bigPhotoElementCommentsText.textContent = bigPhoto.description;
  disableScroll();
};

var hideCommentCounter = function () {
  commentCounter.classList.add('hidden');
};

var hideCommentUploadButton = function () {
  commentUploadButton.classList.add('hidden');
};

var applyPhotoScale = function (value) {
  controlScaleValue.value = value + '%';
  photoPreview.style.transform = 'scale(' + value / 100 + ');';
};

var onChangeEffectImage = function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    if (currentEffect !== effects.none) {
      photoPreview.classList.remove(currentEffect.class);
    }
    currentEffect = effects[evt.target.value];
    photoPreview.style.filter = currentEffect.changeIntensity(1);

    if (currentEffect === effects.none) {
      saturationScale.classList.add('hidden');
    } else {
      photoPreview.classList.add(currentEffect.class);
      saturationScale.classList.remove('hidden');
    }
  }
};

var onDocumentKeydown = function (evt) {
  if (evt.key === 'Escape') {
    closeEditor();
  }
};

var openEditor = function () {
  body.classList.add('modal-open');
  imageEditingForm.classList.remove('hidden');
  saturationScale.classList.add('hidden');
  applyPhotoScale(DEFAULT_SCALE);
  document.addEventListener('keydown', onDocumentKeydown);
};

var closeEditor = function () {
  body.classList.remove('modal-open');
  imageEditingForm.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  effectsReload();
};

var effectsReload = function () {
  photoPreview.style = {
    filter: 'none'
  };
  photoPreview.classList.remove('effects__preview--chrome');
  photoPreview.classList.remove('effects__preview--sepia');
  photoPreview.classList.remove('effects__preview--marvin');
  photoPreview.classList.remove('effects__preview--phobos');
  photoPreview.classList.remove('effects__preview--heat');
};

var decreasePhotoScale = function () {
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue > MIN_SIZE_PHOTO) {
    applyPhotoScale(fieldValue - STEP_SIZE_PHOTO);
  }
};

var increasePhotoScale = function () {
  var fieldValue = parseInt(controlScaleValue.value, 10);
  if (fieldValue < MAX_SIZE_PHOTO) {
    applyPhotoScale(fieldValue + STEP_SIZE_PHOTO);
  }
};

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
};

var onPinMouseDown = function () {
  if (currentEffect) {
    photoPreview.style.filter = 'none';
  }
  var currnetSaturation = pinSaturationEffect.offsetLeft / saturationFilterLine.offsetWidth;
  photoPreview.style.filter = currentEffect.changeIntensity(currnetSaturation);
};


controlFormOpen.addEventListener('change', function () {
  openEditor();
});

controlFormClose.addEventListener('click', function () {
  closeEditor();
});

controlScaleMin.addEventListener('click', function () {
  decreasePhotoScale();
});

controlScaleMax.addEventListener('click', function () {
  increasePhotoScale();
});

fieldsetEffectsPhoto.addEventListener('click', onChangeEffectImage);

hashtagsInput.addEventListener('input', function () {
  validateHashtags();
});

pinSaturationEffect.addEventListener('mouseup', function () {
  onPinMouseDown();
});


buttonSubmit.addEventListener('submit', function (evt) {
  evt.preventDefault();
});

photos = generatePhotos(PHOTOS_COUNT);
createPhotoElements();
hideCommentCounter();
hideCommentUploadButton();


