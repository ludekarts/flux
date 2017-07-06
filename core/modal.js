const Modal = (function() {
  const modal = document.querySelector('div[data-modal]');
  const content = modal.querySelector('.content');
  let currentTarget;

  const show = (target) => {
    currentTarget = target;
    modal.dataset.modal = target.dataset.type;
    modal.classList.add('show');
  };

  const hide = () => {
    modal.classList.remove('show');
  };

  const detectAction = ({target}) => {
    if (target.dataset.action === 'cancel') {
      hide();
    }

    if (target.dataset.action === 'save') {
      // Save Media.
      if (modal.dataset.modal === 'media') {
        currentTarget.setAttribute('alt', modal.querySelector('textarea').value || '');
        currentTarget.querySelector('img').setAttribute('src',( modal.querySelector('input').value + '.jpg') || '');
      }
      // Save Media.
      else if (modal.dataset.modal === 'reference') {
      // TODO: THIS ONE!
      }
      hide();
    }
  };

  modal.addEventListener('click', detectAction);
  return {show, hide};
}());
