
const mediaScaffold = `
  div.content >
    input.input[type="text" placeholder="Image Name"]
    textarea.input[placeholder="Alt text"]
  div.buttons.media >
    button[data-action="save"] > "Save"
    button[data-action="cancel"] > "Cancel"`;


const mathScaffold = `
  div.content >
    input#meq.input[type="text" placeholder="LaTeX Formula"]
    input#cpymml.input[type="text"]
  div.buttons.media >
    button.cmml[data-action="copy"] > "Copy MML"
    button[data-action="save"] > "Save"
    button[data-action="cancel"] > "Cancel"`;

const refsScaffold = `
  div.content >
    input.input[type="text" name="target" placeholder="Target"]
    textarea.input[name="content" placeholder="Content"]
  div.radios >
    span >
      input[id="ref-id" type="radio" name="type" data-dest="target-id" checked="true"]
      label[for="ref-id"] > "Id"
    span >
      input[id="ref-url" type="radio" name="type" data-dest="url"]
      label[for="ref-url"] > "URL"
    span >
      input[id="ref-doc" type="radio" name="type" data-dest="document"]
      label[for="ref-doc"] > "Document"
  div.buttons >
    button[data-action="save"] > "Save"
    button[data-action="cancel"] > "Cancel"`;


const Modal = (function({template, updateMath}) {

  let currentTarget;

  const modal = document.querySelector('div[data-modal]');
  const content = modal.querySelector('.content');

  const templates = {
    math: template(mathScaffold),
    media: template(mediaScaffold),
    reference: template(refsScaffold)
  };

  const applyTemplate = (name) => {
    if (modal.firstElementChild) modal.removeChild(modal.firstElementChild);
    modal.appendChild(templates[name]);
    return name;
  };

  const show = (target) => {
    currentTarget = target;
    modal.classList.add('show');
    modal.dataset.modal = applyTemplate(target.dataset.type || target.tagName.toLowerCase());
  };

  const clean = () =>
    Array.from(modal.querySelectorAll('.input')).forEach(el => el.value = '');

  const hide = () => (modal.classList.remove('show'), clean());

  const dismissModal = ({key}) => (key === 'Escape' && hide());

  const saveMedia = () => {
    const name = modal.querySelector('input').value;
    currentTarget.closest('div[data-type=figure]').id = name;
    currentTarget.querySelector('img').setAttribute('src', (name + '.jpg') || '');
    currentTarget.setAttribute('alt', modal.querySelector('textarea').value || '');
  };

  const saveReference = () => {
    const type = Array.from(modal.querySelectorAll('input[type=radio]')).filter(radio => radio.checked)[0].dataset.dest;
    const content = modal.querySelector('textarea[name=content]').value;
    if (content.length > 0) currentTarget.innerHTML = content;
    currentTarget.setAttribute(type, modal.querySelector('input[name=target]').value || '');
  };

  const saveMath = () => {
    updateMath(currentTarget.dataset.mathId, modal.querySelector('#meq').value);
  };

  const detectAction = ({target}) => {
    if (target.dataset.action === 'cancel') hide();

    else if (target.dataset.action === 'save') {
      if (modal.dataset.modal === 'media') saveMedia();
      else if (modal.dataset.modal === 'math') saveMath();
      else if (modal.dataset.modal === 'reference') saveReference();
      hide();
    }

    else if (target.dataset.action === 'copy') {
      const cpymml = modal.querySelector('#cpymml');
      cpymml.value = currentTarget.querySelector('script').textContent;
      cpymml.select();
      document.execCommand('copy');
    }
  };

  modal.addEventListener('click', detectAction);
  document.addEventListener('keyup', dismissModal);

  return {show, hide};
}(utils, mediaScaffold, refsScaffold));
