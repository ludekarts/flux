const listEditor = (function({createElement, template}) {

  let targetElement;

  const scaffold = `
    div.list-opts >
      div >
        input[id="ol-bullet" type="radio" name="type" data-list="bulleted" data-style="bullet" checked="true"]
        label[for="ol-bullet"] > "Bullet list"
      div >
        input[id="ol-nums" type="radio" name="type" data-list="enumerated" data-style="arabic"]
        label[for="ol-nums"] > "Enumerated: 1, 2, 3"
      div >
        input[id="ol-abc" type="radio" name="type" data-list="enumerated" data-style="lower-alpha"]
        label[for="ol-abc"] > "Enumerated: a, b, c"
      div >
        input[id="ol-roman" type="radio" name="type" data-list="enumerated" data-style="upper-roman"]
        label[for="ol-roman"] > "Enumerated: I, II, III"
    div.list-btns >
      button[data-action="save"] > "Save"
      button[data-action="cancel"] > "Cancel"`;

  const element = template(scaffold);

  const activate = (source) => {
    targetElement = source;
    const list = targetElement.getAttribute('list-type');
    const style = list === 'bulleted'
      ? targetElement.getAttribute('bullet-style')
      : targetElement.getAttribute('number-style');

    if (style) {
      element.querySelector(`input[data-style="${style}"]`).checked = true;
    }
  };

  const clearArrts = (node, exclude) =>
    Array.from(node.attributes).forEach(attr => !~exclude.indexOf(attr.name) && node.removeAttribute(attr.name));

  const save = () => new Promise((resolve) => {
    const radio = Array.from(element.querySelectorAll('input[type=radio]'))
      .filter(radio => radio.checked)[0];

    clearArrts(targetElement,['id', 'data-type']);

    if (radio.dataset.list === 'bulleted') {
      targetElement.setAttribute('list-type', 'bulleted');
      targetElement.setAttribute('bullet-style', 'bullet');
    }
    else if (radio.dataset.list === 'enumerated') {
      targetElement.setAttribute('list-type', 'enumerated');
      targetElement.setAttribute('number-style', radio.dataset.style);
    }

    resolve();
  });

  return {element, activate, save};
}(utils));
