/* eslint-disable indent */
'use strict';

(function () {
  var DEFAULT_SCALE = 100;
  var STEP_SIZE_PHOTO = 25;
  var MIN_SIZE_PHOTO = 25;
  var MAX_SIZE_PHOTO = 100;
  var body = document.querySelector('body');
  var upload = document.querySelector('#upload-select-image');
  var controlFormOpen = upload.querySelector('#upload-file');
  var controlFormClose = upload.querySelector('#upload-cancel');
  var imageEditingForm = upload.querySelector('.img-upload__overlay');
  var pinSaturationEffect = upload.querySelector('.effect-level__pin');
  var saturationFilterLine = upload.querySelector('.effect-level__line');
  var depthFilterLine = upload.querySelector('.effect-level__depth');
  var controlScaleMin = upload.querySelector('.scale__control--smaller');
  var controlScaleMax = upload.querySelector('.scale__control--bigger');
  var controlScaleValue = upload.querySelector('.scale__control--value');
  var photoPreview = upload.querySelector('.img-upload__preview img');
  var fieldsetEffectsPhoto = upload.querySelector('.img-upload__effects');
  var buttonSubmit = upload.querySelector('.img-upload__submit');
  var saturationScale = upload.querySelector('.img-upload__effect-level');
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
    applyEffect(effects.none, 0);
  };

  var onDocumentKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeEditor();
    }
  };

  var applyPhotoScale = function (value) {
    controlScaleValue.value = value + '%';
    photoPreview.style.transform = 'scale(' + value / 100 + ');';
  };

  var onChangeEffectImage = function (evt) {
    if (evt.target.classList.contains('effects__radio')) {
      applyEffect(effects[evt.target.value], 1);
    }
  };

  var applyEffect = function (effect, intensity) {
    if (currentEffect !== effects.none) {
      photoPreview.classList.remove(currentEffect.class);
    }
    currentEffect = effect;
    photoPreview.style.filter = currentEffect.changeIntensity(intensity);

    if (currentEffect === effects.none) {
      saturationScale.classList.add('hidden');
    } else {
      photoPreview.classList.add(currentEffect.class);
      saturationScale.classList.remove('hidden');
    }
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

  var onPinMouseDown = function (evt) {
    var startCoords = {
      x: evt.clientX
    };
    var PIN_X_COORD_MIN = saturationFilterLine.getBoundingClientRect().x;
    var PIN_X_COORD_MAX = saturationFilterLine.getBoundingClientRect().x + saturationFilterLine.offsetWidth;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };
      if (moveEvt.clientX <= PIN_X_COORD_MIN) {
        pinSaturationEffect.style.left = '0px';
      }
      if (moveEvt.clientX >= PIN_X_COORD_MAX) {
        pinSaturationEffect.style.left = saturationFilterLine.offsetWidth + 'px';
      }
      if (moveEvt.clientX > PIN_X_COORD_MIN && moveEvt.clientX < PIN_X_COORD_MAX) {
      pinSaturationEffect.style.left = (pinSaturationEffect.offsetLeft - shift.x) + 'px';
      depthFilterLine.style.width = (pinSaturationEffect.offsetLeft - shift.x) + 'px';
      }
      if (currentEffect) {
        photoPreview.style.filter = 'none';
      }
      var currnetSaturation = pinSaturationEffect.offsetLeft / saturationFilterLine.offsetWidth;
      photoPreview.style.filter = currentEffect.changeIntensity(currnetSaturation);
    };

    var onPinMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  };

  controlScaleMin.addEventListener('click', function () {
    decreasePhotoScale();
  });

  controlScaleMax.addEventListener('click', function () {
    increasePhotoScale();
  });

  pinSaturationEffect.addEventListener('mousedown', onPinMouseDown);

  controlFormOpen.addEventListener('change', function () {
    openEditor();
  });

  controlFormClose.addEventListener('click', function () {
    closeEditor();
  });

  buttonSubmit.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });

  fieldsetEffectsPhoto.addEventListener('click', onChangeEffectImage);

  window.form = {
    upload: upload
  };
})();
