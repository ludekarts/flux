const FluxUtils = {
  // Create DOM element.
  createElement (type, content, fluxType, isWrapper) {
    let classes = ~type.indexOf('.') ? type.split('.') : undefined;
    if (classes) {
      type = classes[0];
      classes = classes.slice(1,classes.length).join(' ');
    }
    const result = document.createElement(type);
    if (classes) result.className = classes;
    if (content) result.innerHTML = content;
    if (fluxType) result.dataset.fluxType = fluxType;
    if (isWrapper) result.dataset.fluxHandle = isWrapper;
    return result;
  },

  // Remove all HTML tags, leaves only Text content.
  strip(elemnt) {
    return elemnt.innerHTML.replace(/(<([^>]+)>)/ig, '').trim();
  }
};
