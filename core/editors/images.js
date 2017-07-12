
const imgEditor = (function({createElement, template}) {

  let targetElement;

  const refs = {
    name : createElement('input.input[type="text" placeholder="Image Name"]'),
    alttext: createElement('textarea.input[placeholder="Alt text"]')
  };

  const scaffold = `
    div.content >
      @name
      @alttext
    div.buttons.media >
      button[data-action="save"] > "Save"
      button[data-action="cancel"] > "Cancel"`;

  const element = template(refs, scaffold);

  const activate = (source) => {
    targetElement = source;
    const src = targetElement.querySelector('img').getAttribute('src');
    // Remove placeholder url.
    refs.name.value = ~src.indexOf('empty') ? '' : src.slice(0, src.lastIndexOf('.'));
    refs.alttext.value = targetElement.getAttribute('alt');
  };

  const save = () => new Promise((resolve) => {
    targetElement.closest('div[data-type=figure]').id = refs.name.value;
    targetElement.querySelector('img').setAttribute('src', (refs.name.value + '.jpg') || '');
    targetElement.setAttribute('alt', refs.alttext.value || '');
    resolve();
  });

  return {element, activate, save};
}(utils));
