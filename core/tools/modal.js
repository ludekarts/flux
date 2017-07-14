
const Modal = (function() {

  const modal = document.querySelector('div[data-modal]');
  const content = modal.querySelector('.content');

  const state = {
    editors: {},
    secondaries: {},
    currentEditor: undefined,
    currentTarget: undefined,
  };

  const show = (target, runSecondary = false) => {

    // Clean inputs.
    Array.from(modal.querySelectorAll('.input')).forEach(input => input.value = '');

    // Reset editor.
    state.currentEditor = undefined;

    // Select editor.
    Object.keys(!runSecondary ? state.editors : state.secondaries)
      .some(selector =>
        target.matches(selector)
          ? !!(state.currentEditor = !runSecondary
            ? state.editors[selector]
            : state.secondaries[selector])
          : false
      );

    // Append UI.
    if (state.currentEditor) {
      modal.classList.add('show');
      if (modal.firstElementChild) modal.removeChild(modal.firstElementChild);
      modal.appendChild(state.currentEditor.element);
      state.currentEditor.activate(target);
    }
  };

  const secondary = (target) => show(target, true);

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

  const register = (selector, editor, isSecondary = false) =>
    !isSecondary
      ? state.editors[selector] = editor
      : state.secondaries[selector] = editor;

  return { show, hide, register, secondary};
}());

Modal.register('table', tableEditor);
Modal.register('reference', refsEditor);
Modal.register('div[data-type=media]', imgEditor);
Modal.register('span[data-type=math]', mathEditor);
Modal.register('div[data-type=list]', listEditor, true);
