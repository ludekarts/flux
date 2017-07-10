const refsEditor = (function({createElement, template}) {

  let targetElement;

  const refs = {
    target : createElement('input.input[type="text" name="target" placeholder="Target"]'),
    content: createElement('textarea.input[name="content" placeholder="Content"]')
  };

  const scaffold = `
    div.content >
      @target
      @content
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

  const element = template(refs, scaffold);

  const activate = (source) => {
    targetElement = source;
    refs.target.value = targetElement.getAttribute('target-id')
      || targetElement.getAttribute('document')
      || targetElement.getAttribute('url')
      || '';
    refs.content.value = targetElement.innerHTML;
  };

  const save = () => {
    const type = Array.from(element.querySelectorAll('input[type=radio]'))
      .filter(radio => radio.checked)[0].dataset.dest;
    targetElement.innerHTML = refs.content.value;
    targetElement.setAttribute(type, refs.target.value || '');
  };

  return {element, activate, save};
}(utils));
