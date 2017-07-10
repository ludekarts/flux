const mathEditor = (function({createElement, template, updateMath}) {

  let targetElement;

  const refs = {
    latex : createElement('input.input[type="text" placeholder="LaTeX Formula"]'),
    cpymml: createElement('input#cpymml.input[type="text"]')
  };

  const scaffold = `
    div.content >
      @latex
      @cpymml
    div.buttons.media >
      button.cmml[data-action="copy"] > "Copy MML"
      button[data-action="save"] > "Save"
      button[data-action="cancel"] > "Cancel"`;

  const element = template(refs, scaffold);

  const activate = (source) => {
    targetElement = source;    
  };

  const save = () => {
    updateMath(targetElement.dataset.mathId, refs.latex.value);
  };

  const copy = () => {
    refs.cpymml.value = targetElement.querySelector('script').textContent;
    refs.cpymml.select();
    document.execCommand('copy');
  };

  return {element, activate, save, copy};
}(utils));
