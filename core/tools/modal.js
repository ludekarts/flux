
const Modal = (function() {

  const modal = document.querySelector('div[data-modal]');
  const content = modal.querySelector('.content');

  const state = {
    editors: {},
    currentEditor: undefined,
    currentTarget: undefined,
  };

  const show = (target) => {

    // Reset editor.
    state.currentEditor = undefined;
    
    // Select editor.
    Object.keys(state.editors)
      .some(selector => target.matches(selector) ? !!(state.currentEditor = state.editors[selector]) : false);

    // Append UI.
    if (state.currentEditor) {
      modal.classList.add('show');
      if (modal.firstElementChild) modal.removeChild(modal.firstElementChild);
      modal.appendChild(state.currentEditor.element);
      state.currentEditor.activate(target);
    }
  };

  const hide = () => modal.classList.remove('show');

  const dismissModal = ({key}) => (key === 'Escape' && hide());

  const detectAction = ({target}) => {
    const action = target.dataset.action;
    if (!action) return;

    if (action === 'cancel') hide();
    else if (state.currentEditor[action]) state.currentEditor[action]().then(hide);
  };

  modal.addEventListener('click', detectAction);
  document.addEventListener('keyup', dismissModal);

  const register = (selector, editor) =>
    state.editors[selector] = editor;

  return { show, hide, register};
}());

Modal.register('reference', refsEditor);
Modal.register('div[data-type=media]', imgEditor);
Modal.register('span[data-type=math]', mathEditor);
