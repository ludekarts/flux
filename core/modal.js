
const Modal = (function() {


  const modal = document.querySelector('div[data-modal]');
  const content = modal.querySelector('.content');

  const state = {
    editors: {
      math: mathEditor,
      media: imgEditor,
      reference: refsEditor
    },
    currentTarget: undefined,
  };

  const show = (target) => {
    const name = target.dataset.type || target.tagName.toLowerCase();
    const editor = state.editors[name];
    modal.classList.add('show');
    modal.dataset.modal = name;
    // Append UI.
    if (modal.firstElementChild) modal.removeChild(modal.firstElementChild);
    modal.appendChild(editor.element);
    editor.activate(target);
  };

  const hide = () => modal.classList.remove('show');

  const dismissModal = ({key}) => (key === 'Escape' && hide());

  const detectAction = ({target}) => {
    const editor = state.editors[modal.dataset.modal];

    if (target.dataset.action === 'cancel') hide();
    else if (target.dataset.action === 'save' && editor) (editor.save(), hide());
    else if (target.dataset.action === 'copy') editor.copy();
  };

  modal.addEventListener('click', detectAction);
  document.addEventListener('keyup', dismissModal);

  return {show, hide};
}(
  // mathEditor,
  // imgEditor,
  refsEditor
));
