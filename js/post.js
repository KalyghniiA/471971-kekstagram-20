'use strict';

(function () {
  var body = document.querySelector('body');
  var bigPhotoElement = document.querySelector('.big-picture');
  var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');
  var commentBlock = bigPhotoElement.querySelector('.social__comments');
  var bigPhotoElementImage = bigPhotoElement.querySelector('.big-picture__img img');
  var bigPhotoElementLikes = bigPhotoElement.querySelector('.likes-count');
  var bigPhotoElementCommentsCounter = bigPhotoElement.querySelector('.comments-count');
  var bigPhotoElementCommentsText = bigPhotoElement.querySelector('.social__caption');
  var bigPhotoButtonClose = bigPhotoElement.querySelector('.big-picture__cancel');
  var commentsInput = bigPhotoElement.querySelector('.social__footer-text');
  var commentCounter = document.querySelector('.social__comment-count');
  var commentUploadButton = document.querySelector('.comments-loader');

  var open = function (bigPhoto) {
    bigPhotoElement.classList.remove('hidden');
    bigPhotoElementImage.src = bigPhoto.url;
    bigPhotoElementLikes.textContent = bigPhoto.likes;
    bigPhotoElementCommentsCounter.textContent = bigPhoto.comments.length;
    createCommentElements(bigPhoto.comments);
    bigPhotoElementCommentsText.textContent = bigPhoto.description;
    disableScroll();
    document.addEventListener('keydown', onBigPhotoPressEsc);
  };

  var onCloseBigPhoto = function () {
    bigPhotoElement.classList.add('hidden');
    enableScroll();
    document.removeEventListener('keydown', onBigPhotoPressEsc);
  };

  var onBigPhotoPressEsc = function (evt) {
    if (evt.key === 'Escape') {
      onCloseBigPhoto();
    }
  };

  var disableScroll = function () {
    body.classList.add('modal-open');
  };

  var enableScroll = function () {
    body.classList.remove('modal-open');
  };

  var clearComment = function () {
    while (commentBlock.firstChild) {
      commentBlock.removeChild(commentBlock.firstChild);
    }
  };

  var hideCommentCounter = function () {
    commentCounter.classList.add('hidden');
  };

  var hideCommentUploadButton = function () {
    commentUploadButton.classList.add('hidden');
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


  commentsInput.addEventListener('keydown', function (evt) {
    window.utils.pressEsc(evt, evt.stopPropogation);
  }
  );
  bigPhotoButtonClose.addEventListener('click', onCloseBigPhoto);

  hideCommentCounter();
  hideCommentUploadButton();


  window.post = {
    open: open
  };
})();
