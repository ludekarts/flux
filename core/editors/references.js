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
        input[id="ref-id" type="radio" name="type" data-dest="target-id"]
        label[for="ref-id"] > "Id"
      span >
        input[id="ref-url" type="radio" name="type" data-dest="url"]
        label[for="ref-url"] > "URL"
      span >
        input[id="ref-doc" type="radio" name="type" data-dest="document"]
        label[for="ref-doc"] > "Document"
      span >
        input[id="ref-doc" type="radio" name="type" data-dest="ext"]
        label[for="ref-doc" title="Document with target-id"] > "Ext"
    div.buttons >
      button[data-action="save"] > "Save"
      button[data-action="cancel"] > "Cancel"`;

  const element = template(refs, scaffold);

  const activate = (source) => {
    targetElement = source;
    const url = targetElement.getAttribute('url');
    const id = targetElement.getAttribute('target-id');
    const doc = targetElement.getAttribute('document');
    refs.target.value = doc || id || url || '';
    refs.content.value = targetElement.innerHTML;

    // Check for external element references.
    if (id && doc) refs.target.value = doc + ', ' + id;

  };

  const clearArrts = (node) =>
    Array.from(node.attributes).forEach(attr => node.removeAttribute(attr.name));

  const save = () => new Promise((resolve) => {
    const type = Array.from(element.querySelectorAll('input[type=radio]'))
      .filter(radio => radio.checked)[0].dataset.dest;
    clearArrts(targetElement);
    targetElement.innerHTML = refs.content.value;

    if (type === 'ext') {
      const attrs = refs.target.value.split(',');
      if (!attrs || attrs.length !== 2) return alert ('Bad argments');
      targetElement.setAttribute('document', attrs[0].trim());
      targetElement.setAttribute('target-id', attrs[1].trim());
    } else {
      targetElement.setAttribute(type, refs.target.value || '');
    }
    if (type === 'document') targetElement.className = 'target-chapter';

    resolve();
  });

  return {element, activate, save};
}(utils));
